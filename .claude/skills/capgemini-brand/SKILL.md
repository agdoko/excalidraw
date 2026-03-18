---
description: Apply Capgemini blue/teal branding to Excalidraw UI chrome (light theme only)
---

Apply Capgemini branding to the Excalidraw UI by replacing the default purple/indigo theme colors with Capgemini blue/teal in the light theme.

## Instructions

1. Read the file `packages/excalidraw/css/theme.scss`

2. **IMPORTANT — order matters for `#6965db`**: This value appears in both `--color-primary` and `--color-selection`, but they need different target colors. Apply the `--color-selection` replacement FIRST (specific match), then the bulk replacement (replace_all).

3. Apply replacements in this exact order using the Edit tool:

**Step A** — Change `--color-selection` specifically (before the bulk replace):

```
old_string: "--color-selection: #6965db"
new_string: "--color-selection: #12abdb"
```

**Step B** — Now replace all remaining `#6965db` → `#0070ad` with `replace_all: true`: This changes `--color-primary` (and any other occurrences) to blue.

**Step C** — Apply the remaining replacements (order doesn't matter, use `replace_all: true` where noted):

| Old Value | New Value | Property | replace_all |
| --- | --- | --- | --- |
| `#5b57d1` | `#005a8c` | --color-primary-darker | false |
| `#4a47b1` | `#004a73` | --color-primary-darkest | false |
| `#e3e2fe` | `#e0f0fa` | --color-primary-light | false |
| `#d7d5ff` | `#c0e0f5` | --color-primary-light-darker | false |
| `#5753d0` | `#005f96` | --color-primary-hover, --color-brand-hover | true |
| `#f1f0ff` | `#e9edf3` | --color-surface-high | false |
| `#e0dfff` | `#d0e8f5` | --color-surface-primary-container (both instances) | true |
| `#030064` | `#00324d` | --color-on-primary-container | false |
| `#4440bf` | `#004a73` | --color-brand-active | false |
| `#190064` | `#1d365a` | --color-logo-text | false |

4. After all replacements, read `packages/excalidraw/css/theme.scss` again and confirm that:
   - No purple/indigo hex values remain (`#6965db`, `#5b57d1`, `#4a47b1`, `#e3e2fe`, `#d7d5ff`, `#5753d0`, `#f1f0ff`, `#e0dfff`, `#030064`, `#4440bf`, `#190064`)
   - All new blue/teal values are present (`#0070ad`, `#005a8c`, `#004a73`, `#e0f0fa`, `#c0e0f5`, `#005f96`, `#e9edf3`, `#d0e8f5`, `#00324d`, `#1d365a`)

Report "Capgemini branding applied successfully" when done.
