#!/usr/bin/env python3
"""Generate reference/static-home/personas-full.js from personaDefinitions.ts (parsed fields + journey templates)."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TS = ROOT / "src/lib/data/personaDefinitions.ts"
OUT = ROOT / "reference/static-home/personas-full.js"

ID_MAP = {
    "client-work": "client",
    "operator-work": "operator",
    "white-collar": "whiteCollar",
    "blue-collar": "blueCollar",
    "grey-collar": "greyCollar",
    "military": "military",
    "client-heal": "healClient",
    "operator-heal": "healOperator",
    "doctor": "healDoctor",
    "senior": "healSenior",
    "patient": "healPatient",
    "nurse": "healNurse",
    "client-play": "playClient",
    "operator-play": "playOperator",
    "sport-fan": "playSportFan",
    "vip-guest": "playVipGuest",
    "participant": "playParticipant",
    "tourist": "playTourist",
    "client-learn": "learnClient",
    "operator-learn": "learnOperator",
    "student": "learnStudent",
    "schoolchild": "learnSchoolchild",
    "parent": "learnParent",
    "teacher": "learnTeacher",
}

HERO_KEY = {
    "client-work": "work-client",
    "operator-work": "work-operator",
    "white-collar": "work-white-collar",
    "blue-collar": "work-blue-collar",
    "grey-collar": "work-grey-collar",
    "military": "work-military",
    "client-heal": "heal-client",
    "operator-heal": "heal-operator",
    "doctor": "heal-doctor",
    "senior": "heal-senior",
    "patient": "heal-patient",
    "nurse": "heal-nurse",
    "client-play": "play-client",
    "operator-play": "play-operator",
    "sport-fan": "play-sport-fan",
    "vip-guest": "play-vip-guest",
    "participant": "play-participant",
    "tourist": "play-tourist",
    "client-learn": "learn-client",
    "operator-learn": "learn-operator",
    "student": "learn-student",
    "schoolchild": "learn-schoolchild",
    "parent": "learn-parent",
    "teacher": "learn-teacher",
}


def extract_str_array(field: str, block: str) -> list[str]:
    m = re.search(rf"{field}:\s*\[([\s\S]*?)\]\s*,", block)
    if not m:
        return []
    inner = m.group(1)
    items: list[str] = []
    for a, b in re.findall(r"'((?:\\'|[^'])*)'|\"((?:\\.|[^\"])*)\"", inner):
        if a:
            items.append(a.replace("\\'", "'"))
        elif b:
            items.append(b.replace("\\\"", '"').replace("\\n", "\n"))
    return items


def extract_scalar(field: str, block: str) -> str:
    m = re.search(rf"{field}:\s*'((?:\\'|[^'])*)'", block)
    if m:
        return m.group(1).replace("\\'", "'")
    return ""


def extract_quote(block: str) -> str:
    m = re.search(r"quote:\s*'([\s\S]*?)',\s*emoji:", block)
    if m:
        return m.group(1).strip().replace("\\'", "'")
    m = re.search(r'quote:\s*"([\s\S]*?)",\s*emoji:', block)
    if m:
        return m.group(1).strip().replace('\\"', '"')
    return ""




WORK_MODULES = """[
              { id: 'conciergerie', name: 'Conciergerie', solutionId: 'circles' },
              { id: 'digital-apps', name: 'Digital Apps', solutionId: 'everyday' },
              { id: 'smart-vending', name: 'Smart Vending', solutionId: 'totem' },
              { id: 'self-checkout-ai', name: 'Self-Checkout AI', solutionId: 'mashgin' },
              { id: 'food-waste', name: 'Food Waste', solutionId: 'kikleo' },
              { id: 'autonomous-stores', name: 'Autonomous Stores', solutionId: 'aifi' },
              { id: 'ai-tools', name: 'AI Tools', solutionId: 'menuai' },
              { id: 'safety-compliance', name: 'Safety & Compliance', solutionId: 'salus' },
              { id: 'delivery-robots', name: 'Delivery Robots', solutionId: 'starship' },
              { id: 'service-robots', name: 'Service Robots', solutionId: 'userveRobot' },
              { id: 'circular-economy', name: 'Circular Economy', solutionId: 'circularPlace' },
              { id: 'feedback', name: 'Feedback', solutionId: 'qualtrics' },
              { id: 'food-safety', name: 'Food Safety', solutionId: 'icertainty' },
              { id: 'analytics', name: 'Analytics', solutionId: '4site' },
              { id: 'hydration', name: 'Hydration', solutionId: 'aquablu' },
              { id: 'fm-operations', name: 'FM Operations', solutionId: 'inspekly' }
            ]"""

INTRO = (
    "[\n              '<p>This page follows: <strong>who this persona is</strong>, <strong>why our modular platform works</strong>, "
    "then the <strong>consumer journey</strong> (tap each moment on the map), and finally <strong>Experience modules</strong> "
    "at the end to open solution details where linked.</p>'\n            ]"
)

MODULAR = (
    "'<p>Instead of one fixed bundle, Sodexo combines <strong>interchangeable modules</strong> — concierge, digital apps, smart vending, "
    "analytics, robotics, and more. You activate the mix that fits your site, your policy, and your people.</p>"
    "<p>Each module shares the same experience principles: <strong>clarity, relevance, and seamless service</strong> across physical and digital touchpoints.</p>"
    "<p>The puzzle illustration is a <strong>simplified view of how modules connect</strong>. Below it: the <strong>journey map</strong> (moments in the day), "
    "then <strong>Experience modules</strong> — pick a module to open a solution detail.</p>'"
)

J_WORK = """[
              { id: 'commute', title: 'Commute', left: 5, top: 34, w: 16, h: 22, body: '<p><strong>Starting the day</strong> — from home to the workplace.</p>' },
              { id: 'welcome', title: 'Welcome area', left: 22, top: 30, w: 15, h: 24, body: '<p><strong>First impression</strong> — reception, wayfinding, visitor management.</p>' },
              { id: 'workplace', title: 'Workplace', left: 40, top: 26, w: 18, h: 28, body: '<p><strong>Core productivity</strong> — desk booking, focus and collaboration.</p>' },
              { id: 'wellbeing', title: 'Wellbeing & break time', left: 56, top: 40, w: 16, h: 24, body: '<p><strong>Recharging</strong> — break room, wellness, hydration.</p>' },
              { id: 'food', title: 'Food & beverage area', left: 70, top: 46, w: 16, h: 26, body: '<p><strong>Peak traffic</strong> — cafeteria, vending, digital ordering.</p>' }
            ]"""

J_BLUE = """[
              { id: 'commute', title: 'Commute', left: 5.5, top: 32, w: 8, h: 13, body: '<p><strong>Starting the day</strong> — shift commute and site access.</p>' },
              { id: 'welcome', title: 'Welcome area', left: 19, top: 80, w: 10, h: 15, body: '<p><strong>Site entry</strong> — reception, lockers, safety.</p>' },
              { id: 'workplace', title: 'Workplace', left: 19, top: 7, w: 11, h: 15, body: '<p><strong>On the floor</strong> — production and operations.</p>' },
              { id: 'wellbeing', title: 'Wellbeing & break time', left: 12, top: 66, w: 11, h: 14, body: '<p><strong>Breaks</strong> — rest and recovery.</p>' },
              { id: 'food', title: 'Food & beverage area', left: 77, top: 7, w: 12, h: 15, body: '<p><strong>F&amp;B</strong> — fast service for shifts.</p>' }
            ]"""

J_LEARN = """[
              { id: 'arrival', title: 'Campus arrival', left: 8, top: 28, w: 18, h: 26, body: '<p><strong>Arrival</strong> — orientation and first services.</p>' },
              { id: 'morning', title: 'Morning class', left: 28, top: 28, w: 18, h: 26, body: '<p><strong>Learning</strong> — focus and energy.</p>' },
              { id: 'lunch', title: 'Lunch break', left: 48, top: 40, w: 18, h: 26, body: '<p><strong>Social meal</strong> — speed and choice.</p>' },
              { id: 'study', title: 'Study session', left: 68, top: 48, w: 18, h: 24, body: '<p><strong>Study</strong> — hydration and snacks.</p>' }
            ]"""

J_HEAL = """[
              { id: 'rounds', title: 'Morning rounds', left: 6, top: 32, w: 18, h: 26, body: '<p><strong>Rounds</strong> — care planning and meals.</p>' },
              { id: 'mealsvc', title: 'Meal service', left: 28, top: 28, w: 18, h: 28, body: '<p><strong>Service</strong> — nutrition and safety.</p>' },
              { id: 'dist', title: 'Meal distribution', left: 50, top: 38, w: 18, h: 26, body: '<p><strong>Distribution</strong> — timing and diets.</p>' },
              { id: 'kitchen', title: 'Kitchen prep', left: 72, top: 44, w: 16, h: 28, body: '<p><strong>Back of house</strong> — quality and waste.</p>' }
            ]"""

J_PLAY = """[
              { id: 'prematch', title: 'Pre-match', left: 5, top: 34, w: 16, h: 22, body: '<p><strong>Arrival</strong> — crowds and first purchases.</p>' },
              { id: 'peak', title: 'Peak service', left: 26, top: 30, w: 18, h: 26, body: '<p><strong>Peak</strong> — throughput.</p>' },
              { id: 'half', title: 'Half time', left: 48, top: 36, w: 16, h: 24, body: '<p><strong>Half time</strong> — rush service.</p>' },
              { id: 'full', title: 'Full time', left: 66, top: 44, w: 16, h: 24, body: '<p><strong>Exit</strong> — flow and feedback.</p>' },
              { id: 'network', title: 'Networking lunch', left: 84, top: 52, w: 14, h: 20, body: '<p><strong>Networking</strong> — premium moments.</p>' }
            ]"""


def js_array_str(items: list[str]) -> str:
    return "[\n              " + ",\n              ".join(json.dumps(x, ensure_ascii=False) for x in items) + "\n            ]"


def main() -> None:
    text = TS.read_text(encoding="utf-8")
    parts = re.split(r"\n  w\(\{", text)
    chunks: dict[str, str] = {}
    for raw in parts[1:]:
        m_id = re.search(r"id: '([^']+)'", raw)
        if not m_id:
            continue
        pid = m_id.group(1)
        if pid in ID_MAP:
            chunks[pid] = raw

    out: list[str] = [
        "/** Auto-generated by scripts/generate-static-personas.py */",
        "(function () {",
        "  window.STATIC_PERSONA_FULL = {",
    ]

    for pid in sorted(chunks.keys(), key=lambda x: ID_MAP.get(x, x)):
        sk = ID_MAP[pid]
        block = chunks[pid]
        area = extract_scalar("area", block)
        name = extract_scalar("name", block)
        full_name = extract_scalar("fullName", block)
        role = extract_scalar("role", block)
        eyebrow = extract_scalar("profileEyebrow", block) or name
        seg = extract_scalar("platformSegmentLabel", block) or eyebrow
        quote = extract_quote(block)
        ws = extract_str_array("workplaceStats", block)
        pg = extract_str_array("professionalGoals", block)
        mot = extract_str_array("motivations", block)
        pains = extract_str_array("pains", block)
        needs = extract_str_array("needs", block)

        if area == "work":
            jmap = "./assets/catalogue/journey-work-blue-collar.svg" if pid == "blue-collar" else "./assets/catalogue/journey-work-white-collar.svg"
            jmom = J_BLUE if pid == "blue-collar" else J_WORK
            aid = "WORK"
            parent_line = ""
        elif area == "learn":
            jmap = "./assets/catalogue/journey-learn.svg"
            jmom = J_LEARN
            aid = "LEARN"
            parent_line = "\n            parentAreaKey: 'learn',"
        elif area == "heal":
            jmap = "./assets/catalogue/journey-heal.svg"
            jmom = J_HEAL
            aid = "HEAL"
            parent_line = "\n            parentAreaKey: 'heal',"
        else:
            jmap = "./assets/catalogue/journey-play.svg"
            jmom = J_PLAY
            aid = "PLAY"
            parent_line = "\n            parentAreaKey: 'play',"

        hk = HERO_KEY[pid]
        hero_path = f"./assets/catalogue/{hk}.png"
        block_js = f"""        {json.dumps(sk)}: {{
            label: {json.dumps(name)},
            areaId: {json.dumps(aid)},
            screen: 'white-collar',
            hero: {json.dumps(hero_path)},
            platformSegment: {json.dumps(seg)},
            personaEyebrow: {json.dumps(eyebrow)},
            personaName: {json.dumps(full_name)},
            personaRole: {json.dumps(role)},
            personaQuote: {json.dumps(quote)},
            personaBio: '',
            workplaceStats: {js_array_str(ws)},
            professionalGoals: {js_array_str(pg)},
            motivations: {js_array_str(mot)},
            pains: {js_array_str(pains)},
            needs: {js_array_str(needs)},
            introParagraphs: {INTRO},
            modularExplainHtml: {MODULAR},
            puzzleImage: './assets/catalogue/modular-platform-puzzle.svg',
            journeyMapImage: {json.dumps(jmap)},
            defaultSolutionId: 'circles',
            modules: {WORK_MODULES},
            journeyMoments: {jmom},{parent_line}
          }}"""
        out.append(block_js + ",")

    out.append("  };")
    out.append("})();")

    OUT.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(chunks)} personas)")


if __name__ == "__main__":
    main()
