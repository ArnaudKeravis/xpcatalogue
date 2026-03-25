# AGENTS.md

## Cursor Cloud specific instructions

This is a **data-only catalogue repository** (no application code, no services to run). The "development environment" consists of validation tooling for the YAML experience files.

### Key tools

| Tool | Purpose | Command |
|---|---|---|
| `yamllint` | Lint YAML files for syntax/style | `yamllint catalogue/` |
| `check-jsonschema` | Validate YAML against JSON Schema | `check-jsonschema --schemafile catalogue/schema/experience.schema.json catalogue/experiences/claude/*.yaml` |

Both tools are installed via `pip install check-jsonschema yamllint` (handled by the update script).

### Important notes

- **PATH**: Tools install to `~/.local/bin`. The update script adds this to PATH. If running commands manually, ensure `export PATH="$HOME/.local/bin:$PATH"` is set.
- **Schema vs. YAML mismatch**: The existing experience YAML files do not fully conform to `catalogue/schema/experience.schema.json`. Schema validation errors on existing files are pre-existing, not regressions.
- **`.yamllint.yml`**: A relaxed yamllint config is committed at the repo root. It disables `document-start` and raises `line-length` to 200 (prompt templates often have long lines).
- **No services**: There are no backend/frontend services, databases, or build steps. Validation is the only "run" action.
- See `README.md` for the catalogue structure, naming conventions, and contribution workflow.
