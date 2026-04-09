# Excalidraw demo — runbook

`claude-public` (≥2.1.32). Agent Teams + in-process mode already enabled in `.claude/settings.local.json`.

## Pre-flight

```
cd ~/code/excalidraw
claude-public
```
```
/mcp           # auth Atlassian — browser pops
/clean-demo    # hard reset to checkpoint, fresh demo-* branch, yarn reinstall (~1-2 min)
/model haiku
```
Second terminal tab ready for `yarn start`.

## Run

| # | Do | Check |
|---|---|---|
| 1 | `tell me about this codebase` | explores monorepo |
| 2 | `/init` | shows generated CLAUDE.md |
| 3 | tab 2: `yarn start` → browser | default purple, sharp/round toggle only. Ctrl+C. |
| 4 | `/sage-brand` | green `#00D639` lands in theme files |
| 5 | `find me the jira ticket about corner radius` | MCP → Atlassian, ticket surfaces |
| 6 | paste **Agent Teams prompt** below | team spawns, Shift+Down cycles teammates |
| 7 | tab 2: `yarn start` → browser | Sage green chrome + radius slider on rounded rectangles |

## Agent Teams prompt (paste at step 6)

```
Create an agent team to implement the corner radius slider from that Jira ticket. Three teammates:

- planner: read the ticket and packages/element/src/types.ts, packages/excalidraw/actions/actionProperties.tsx, packages/excalidraw/appState.ts, then write PLAN.md at repo root listing exactly which files change. Require plan approval before the others start.
- implementer: use the action-integration-agent type. Once the plan is approved, add cornerRadius to the element type, create the action and slider UI, wire AppState.
- tester: use the test-agent type. Once implementer commits, write a vitest suite (max 5 tests): cornerRadius persists, slider only shows when Rounded enabled, undo/redo works.

Wait for teammates to finish before proceeding.
```

Shift+Down to cycle. `shift+tab` to auto mode first if permission prompts get noisy.

## Fallback (if team doesn't spawn)

Paste the Jira ticket text, then: `implement this — use the action-integration-agent for the feature and test-agent for tests`. Proven subagent route.

## Reset

`clean up the team` → `/clean-demo`

## Files

```
.claude/
├── agents/       action-integration-agent.md, test-agent.md (used as teammate types)
├── commands/     clean-demo.md, demo-pr.md
├── skills/       sage-brand/, excalidraw-test-patterns/, ecoa-conversion/
└── settings.local.json
```
