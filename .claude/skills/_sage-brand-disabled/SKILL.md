---
description: Apply Sage green branding to Excalidraw UI chrome (light theme only)
---

Apply Sage branding to the Excalidraw UI by replacing the default purple/indigo theme colors with Sage green/dark-teal in the light theme.

## Instructions

1. Read the file `packages/excalidraw/css/theme.scss`

2. **IMPORTANT — order matters for `#6965db`**: This value appears in both `--color-primary` and `--color-selection`, but they need different target colors. Apply the `--color-selection` replacement FIRST (specific match), then the bulk replacement (replace_all).

3. Apply replacements in this exact order using the Edit tool:

**Step A** — Change `--color-selection` specifically (before the bulk replace):
```
old_string: "--color-selection: #6965db"
new_string: "--color-selection: #66e788"
```

**Step B** — Now replace all remaining `#6965db` → `#00d639` with `replace_all: true`:
This changes `--color-primary` (and any other occurrences) to Sage green.

**Step C** — Apply the remaining replacements (order doesn't matter, use `replace_all: true` where noted):

| Old Value | New Value | Property | replace_all |
|-----------|-----------|----------|-------------|
| `#5b57d1` | `#00b82f` | --color-primary-darker | false |
| `#4a47b1` | `#009926` | --color-primary-darkest | false |
| `#e3e2fe` | `#e0fae8` | --color-primary-light | false |
| `#d7d5ff` | `#c2f5d1` | --color-primary-light-darker | false |
| `#5753d0` | `#00c233` | --color-primary-hover, --color-brand-hover | true |
| `#f1f0ff` | `#eaf9ee` | --color-surface-high | false |
| `#e0dfff` | `#d1f7dc` | --color-surface-primary-container (both instances) | true |
| `#030064` | `#003349` | --color-on-primary-container | false |
| `#4440bf` | `#009926` | --color-brand-active | false |
| `#190064` | `#003349` | --color-logo-text | false |

4. After all replacements, read `packages/excalidraw/css/theme.scss` again and confirm that:
   - No purple/indigo hex values remain (`#6965db`, `#5b57d1`, `#4a47b1`, `#e3e2fe`, `#d7d5ff`, `#5753d0`, `#f1f0ff`, `#e0dfff`, `#030064`, `#4440bf`, `#190064`)
   - All new Sage green values are present (`#00d639`, `#00b82f`, `#009926`, `#e0fae8`, `#c2f5d1`, `#00c233`, `#eaf9ee`, `#d1f7dc`, `#003349`, `#66e788`)

Report "Sage branding applied successfully" when done.
