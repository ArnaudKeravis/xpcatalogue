#!/usr/bin/env python3
"""Unpack Personae_Images_{Face,Full,Portrait}.zip into public assets and regenerate
`personaAssetUrls.ts` with stable URLs /images/catalogue/assets/personae/{face,full,portrait}/<personaId>.png

Filename stems (personae_<AREA>_<slug>_face.png) map to catalogue persona ids.
"""

from __future__ import annotations

import json
import re
import shutil
import sys
import zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT_DIR = REPO / "public/images/catalogue/assets/personae"
TS_OUT = REPO / "src/lib/data/personaAssetUrls.ts"

DEFAULT_FACE = Path.home() / "Downloads/Personae_Images_Face.zip"
DEFAULT_FULL = Path.home() / "Downloads/Personae_Images_Full.zip"
DEFAULT_PORTRAIT = Path.home() / "Downloads/Personae_Images_Portrait.zip"

# Normalized stem from personae_<stem>_face.png → persona id (single source of truth)
STEM_TO_ID: dict[str, str] = {
    "WORK_admin_function": "white-collar",
    "WORK_army_officer": "military",
    "WORK_lab_researcher": "grey-collar",
    "WORK_portfolio_manager": "client-work",
    "WORK_production_line_worker": "blue-collar",
    "WORK_site_manager": "operator-work",
    "HEAL_healthcare_portfolio_manager": "client-heal",
    "HEAL_hospital_physician": "doctor",
    "HEAL_long_term_resident": "senior",
    "HEAL_outpatient_&_inpatient": "patient",
    "HEAL_registered_nurse": "nurse",
    "HEAL_site_manager": "operator-heal",
    "LEARN_Campus_Portfolio_Manager": "client-learn",
    "LEARN_middle_school_child": "schoolchild",
    "LEARN_middle_shcool_teacher": "teacher",  # typo in export filename
    "LEARN_site_manager": "operator-learn",
    "LEARN_university_student": "student",
    "LEARN_working_parent_of_school_age_children": "parent",
    "PLAY_business_traveller_&_VIP_guest": "tourist",
    # Same persona id as business traveller; whichever zip entry is processed last wins on disk.
    "PLAY_cultural_tourist_&_museum_visitor": "tourist",
    "PLAY_executive_&_premium_event_guest": "vip-guest",
    "PLAY_parent_&_sports_fan": "sport-fan",
    "PLAY_site_manager": "operator-play",
    "PLAY_trade_show_&_event_attendent": "participant",
    "PLAY_venue_portfolio_manager": "client-play",
    # Portrait zip uses different slug casing / spelling than face/portrait elsewhere
    "LEARN_campus_portfolio_manager": "client-learn",
    "LEARN_middle_school_teacher": "teacher",
}

# Full zip uses inconsistent naming — exact basename → id
FULL_BASENAME_TO_ID: dict[str, str] = {
    "personae_HEAL_healthcare_portfolio_manager_full.png": "client-heal",
    "personae_HEAL_hospital_physician_full.png": "doctor",
    "personae_HEAL_Long_Term_Resident.png": "senior",
    "personae_HEAL_Outpatient_&_Inpatient.png": "patient",
    "personae_HEAL_registered_nurse_full.png": "nurse",
    "personae_HEAL_Site_Manager 1.png": "operator-heal",
    "personae_LEARN_Campus_Portfolio_Manager.png": "client-learn",
    "personae_LEARN_Middle_School_Child.png": "schoolchild",
    "personae_LEARN_Middle_School_Teacher.png": "teacher",
    "personae_LEARN_Site_Manager.png": "operator-learn",
    "personae_LEARN_University_Student.png": "student",
    "personae_LEARN_Working_Parent_of_School_Age_Children.png": "parent",
    "personae_PLAY_Business_Traveller_&_VIP_Guest.png": "tourist",
    "personae_PLAY_Cultural_Tourist_&_Museum_Visitor.png": "tourist",  # second art for same persona (overwrites)
    "personae_PLAY_Executive_&_Premium_Event_Guest.png": "vip-guest",
    "personae_PLAY_Parent_&_Sports_Fan.png": "sport-fan",
    "personae_PLAY_Site_Manager 1.png": "operator-play",
    "personae_PLAY_Trade_Show_&_Event_Attendent.png": "participant",
    "personae_PLAY_Venue_Portfolio_Manager.png": "client-play",
    "personae_WORK_admin_function_full.png": "white-collar",
    "personae_WORK_Army_Officer.png": "military",
    "personae_WORK_lab_researcher_full.png": "grey-collar",
    "personae_WORK_portfolio_manager_full.png": "client-work",
    "personae_WORK_Production_Line_Worker.png": "blue-collar",
    "personae_WORK_Site_Manager.png": "operator-work",
}


def emit_ts(ids_face: dict[str, str], ids_full: dict[str, str], ids_portrait: dict[str, str]) -> str:
    """ids_* map personaId -> relative url path."""
    all_ids = sorted(set(ids_face) | set(ids_full) | set(ids_portrait))

    def block(name: str, d: dict[str, str]) -> str:
        lines = [f"export const {name}: Record<string, string> = {{"]
        for pid in all_ids:
            if pid in d:
                lines.append(f'  "{pid}": "{d[pid]}",')
        lines.append("};")
        return "\n".join(lines)

    header = '''/**
 * Persona imagery — three crops synced from design exports (`scripts/sync-personae-images-from-zips.py`).
 * - face: small circular avatars (home page, chips)
 * - full: hero on persona profile / description
 * - portrait: area listing cards (`/[area]`)
 */

const BASE = "/images/catalogue/assets/personae";

'''
    return (
        header
        + block("PERSONA_FACE_URL", ids_face)
        + "\n\n"
        + block("PERSONA_FULL_URL", ids_full)
        + "\n\n"
        + block("PERSONA_LISTING_URL", ids_portrait)
        + "\n"
    )


def main() -> int:
    face_zip = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_FACE
    full_zip = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_FULL
    portrait_zip = Path(sys.argv[3]) if len(sys.argv) > 3 else DEFAULT_PORTRAIT

    for z, label in [(face_zip, "Face"), (full_zip, "Full"), (portrait_zip, "Portrait")]:
        if not z.exists():
            sys.stderr.write(f"error: {label} zip not found: {z}\n")
            return 2

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for sub in ("face", "full", "portrait"):
        (OUT_DIR / sub).mkdir(parents=True, exist_ok=True)

    face_pat = re.compile(r"personae_(.+)_face\.png$", re.I)
    face_plain_pat = re.compile(r"personae_(.+)\.png$", re.I)
    portrait_pat = re.compile(r"personae_(.+)_portrait\.png$", re.I)

    id_face: dict[str, str] = {}
    id_full: dict[str, str] = {}
    id_portrait: dict[str, str] = {}

    skipped: list[str] = []

    # ── Face ─────────────────────────────────────────────────────────────
    zf = zipfile.ZipFile(face_zip)
    for name in zf.namelist():
        if name.endswith("/"):
            continue
        base = Path(name).name
        m = face_pat.match(base)
        if m:
            stem = m.group(1)
        else:
            m2 = face_plain_pat.match(base)
            if not m2:
                skipped.append(f"face: {base}")
                continue
            stem = m2.group(1)
        pid = STEM_TO_ID.get(stem)
        if not pid:
            skipped.append(f"face unmapped stem {stem!r} ({base})")
            continue
        dst = OUT_DIR / "face" / f"{pid}.png"
        with zf.open(name) as src, open(dst, "wb") as out:
            shutil.copyfileobj(src, out)
        id_face[pid] = f"/images/catalogue/assets/personae/face/{pid}.png"
    zf.close()

    # ── Full ─────────────────────────────────────────────────────────────
    zf = zipfile.ZipFile(full_zip)
    for name in zf.namelist():
        if name.endswith("/"):
            continue
        base = Path(name).name
        pid = FULL_BASENAME_TO_ID.get(base)
        if not pid:
            skipped.append(f"full unmapped {base}")
            continue
        dst = OUT_DIR / "full" / f"{pid}.png"
        with zf.open(name) as src, open(dst, "wb") as out:
            shutil.copyfileobj(src, out)
        id_full[pid] = f"/images/catalogue/assets/personae/full/{pid}.png"
    zf.close()

    # ── Portrait ─────────────────────────────────────────────────────────
    zf = zipfile.ZipFile(portrait_zip)
    for name in zf.namelist():
        if name.endswith("/"):
            continue
        base = Path(name).name
        m = portrait_pat.match(base)
        if not m:
            skipped.append(f"portrait: {base}")
            continue
        stem = m.group(1)
        pid = STEM_TO_ID.get(stem)
        if not pid:
            skipped.append(f"portrait unmapped stem {stem!r} ({base})")
            continue
        dst = OUT_DIR / "portrait" / f"{pid}.png"
        with zf.open(name) as src, open(dst, "wb") as out:
            shutil.copyfileobj(src, out)
        id_portrait[pid] = f"/images/catalogue/assets/personae/portrait/{pid}.png"
    zf.close()

    TS_OUT.write_text(emit_ts(id_face, id_full, id_portrait), encoding="utf-8")

    print(f"wrote images under {OUT_DIR.relative_to(REPO)}/{{face,full,portrait}}/")
    print(f"wrote {TS_OUT.relative_to(REPO)}")
    print(f"coverage: face={len(id_face)} full={len(id_full)} portrait={len(id_portrait)}")
    if skipped:
        print(f"notes ({len(skipped)}):")
        for s in skipped[:15]:
            print(" ", s)
        if len(skipped) > 15:
            print(f"  ... +{len(skipped) - 15} more")
    return 0


if __name__ == "__main__":
    sys.exit(main())
