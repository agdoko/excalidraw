# Claude Code Tech Talk Demo (2.5k Developers)

20-minute slot (~12 min active demo). Runs on **Haiku** model. Subagents run on **Sonnet**.

## Pre-Demo Checklist

1. Run `/mcp` to refresh MCP tokens (Atlassian/Jira)
2. Run `/clean-demo` to reset repo
3. Switch model to Haiku
4. Open two VS Code terminal tabs: one for Claude, one for `yarn start`
5. Have Jira ticket ready (search query prepared)

## Demo Flow (~12 mins)

| # | Action | Shows | Notes |
|---|--------|-------|-------|
| 1 | Pre-select Haiku | Model choice | Before demo starts |
| 2 | "tell me about this codebase" | Codebase understanding | |
| 3 | Compare to Copilot | Quality difference | Verbal comparison |
| 4 | `/init` → show CLAUDE.md | Context system | |
| 5 | `yarn start` in 2nd tab → show BEFORE | Working app | Round vs sharp corners |
| 6 | `/capgemini-brand` | Skills | Changes UI to blue/teal |
| 7 | Search Jira ticket via MCP | MCP integrations | Ticket already exists |
| 8 | Plan mode for radius feature | Planning | |
| 9 | Implement with subagents | Subagents (test + action-integration) | Sonnet subagents |
| 10 | `yarn start` in 2nd tab → show AFTER | Working feature | Radius slider visible |

### `yarn start` Strategy
Run in a **second VS Code terminal tab** (Ctrl+Shift+\`). Claude stays in the first tab, unblocked. Kill the server with Ctrl+C between showings.

## Demo Script

### Step 1-3: Codebase Understanding (3 min)

Switch model to Haiku, then ask:
```
tell me about this codebase
```

While Claude explores, talk about how Claude Code understands entire codebases — not just open files. Compare to Copilot's file-level context.

### Step 4: Context System (1 min)

```
/init
```

Show the generated CLAUDE.md. Explain that this captures project conventions, architecture, and patterns for all future sessions.

### Step 5: Show Before State (1 min)

In second terminal tab: `yarn start`. Open browser, show the app. Note the default purple Excalidraw theme and rectangle corners.

Ctrl+C to kill the server.

### Step 6: Branding Skill (2 min)

```
/capgemini-brand
```

Show how a prescriptive skill applies Capgemini blue/teal branding with mechanical find-replace. Explain skills as reusable, shareable knowledge.

### Step 7: Jira via MCP (1 min)

Search for the Jira ticket describing the radius feature. Show MCP connecting Claude directly to enterprise tools — Jira, Confluence, Slack, databases.

### Step 8-9: Plan Mode + Subagents (3 min)

Paste the feature request from the Jira ticket. Show plan mode activation, then implementation with subagents:
- **test-agent**: Writes Vitest tests
- **action-integration-agent**: Creates action + wires UI panel

### Step 10: Show After State (1 min)

In second terminal tab: `yarn start`. Show:
- Blue/teal Capgemini branding applied
- Radius slider visible when rectangle is selected with "Rounded" enabled
- Slider adjusts corner radius in real-time

## Key Features to Highlight

- **Codebase understanding** — Explores entire repo, not just open files
- **CLAUDE.md context** — Persistent project knowledge
- **Skills** — Reusable, prescriptive workflows (`/capgemini-brand`)
- **MCP integrations** — Jira, Slack, databases directly in the IDE
- **Plan mode** — Think before coding
- **Subagents** — Specialized agents for specific tasks
- **Slash commands** — Custom workflows (`/clean-demo`, `/demo-pr`)

## Reset Between Demos

```
/clean-demo
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| MCP auth expired | Run `/mcp` to refresh tokens |
| Haiku fails branding | Skill is pure mechanical find-replace, retry once |
| Haiku fails radius | Subagents run on Sonnet; main agent just delegates |
| yarn start blocks | Use separate terminal tab |
| Demo needs full reset | `/clean-demo` resets everything |

## Files in This Demo

```
.claude/
├── agents/
│   ├── test-agent.md                # Vitest test writing (Sonnet)
│   └── action-integration-agent.md  # Excalidraw actions (Sonnet)
├── commands/
│   ├── clean-demo.md                # Reset repo
│   └── demo-pr.md                   # Create PR
├── skills/
│   ├── capgemini-brand/             # Capgemini branding
│   └── excalidraw-test-patterns/    # Test patterns
└── demo.md                          # This file
```
