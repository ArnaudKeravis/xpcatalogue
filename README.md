# AI Experience Catalogue

This repository is a starter kit to build an **AI experience catalogue**: a structured list of repeatable AI use-cases (prompts + workflow + quality rules + outcomes).

It is designed so you can start from experiences you already created with Claude, then scale to other models later.

## Why this helps

Without structure, AI experiences become hard to reuse and improve.  
With a catalogue, each experience has:

- a clear business goal
- required inputs
- a tested prompt strategy
- output quality criteria
- known risks and guardrails
- measurable impact

## Repository structure

```text
catalogue/
  experiences/
    claude/
      customer-email-draft.yaml
      release-notes-summary.yaml
  schema/
    experience.schema.json
  template/
    experience-template.yaml
```

## Quick start

1. Duplicate `catalogue/template/experience-template.yaml`
2. Save it under `catalogue/experiences/<model-or-team>/<slug>.yaml`
3. Fill all required fields
4. Keep one file = one experience
5. Review with the checklist below before publishing

## Experience quality checklist

Before adding an experience, verify:

- [ ] Goal is explicit and measurable
- [ ] Inputs are clear and realistically available
- [ ] Prompt instructions include constraints and output format
- [ ] Human review step is defined (if needed)
- [ ] Known failure modes and mitigations are listed
- [ ] KPIs are defined to measure value
- [ ] Example output is included

## Suggested lifecycle

Use these statuses in `lifecycle.status`:

- `draft`: work in progress, not production-ready
- `validated`: tested and approved for regular use
- `deprecated`: no longer recommended

## Naming convention

Use short, searchable file names:

`<domain>-<use-case>.yaml`

Examples:

- `sales-followup-email.yaml`
- `incident-postmortem-summary.yaml`
- `product-feedback-clustering.yaml`

## Contributing new experiences

When adding a new experience:

1. Copy the template
2. Fill required fields
3. Add at least one realistic example output
4. Ask a teammate to run the workflow once and give feedback
5. Update `lifecycle.last_reviewed` after validation

---

If you already started with Claude, begin by documenting your top 3 successful prompts first, then standardize them using the template.
