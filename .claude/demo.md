# Excalidraw demo — runbook (SocGen Apr 10)

`claude-public` (≥2.1.32). Opus. Agent Teams via env var.

## Pre-flight (one-time, before screen-share)

```bash
cd ~/code/excalidraw
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1   # required on public build
./reset.sh                                       # or /clean-demo inside CC — same thing
```

**Tmux layout** — two panes, side by side. Left = CC, right = app:
```bash
tmux kill-session -t sg 2>/dev/null
tmux new-session -d -s sg -c ~/code/excalidraw
tmux split-window -h -t sg -c ~/code/excalidraw
tmux send-keys -t sg:0.0 'claude-public' C-m
tmux attach -t sg
```
Bump font now (⌘+). Left pane is where you live; right pane stays idle until step 6.

In left pane (CC):
```
/mcp           # auth Atlassian — browser pops, approve
/model opus
```

## Run

| # | Do (left pane unless noted) | Check |
|---|---|---|
| 1 | `tell me about this codebase` | explores monorepo |
| 2 | `/init` | shows generated CLAUDE.md |
| 3 | right pane: `yarn start` → browser | default purple, sharp/round toggle only. Ctrl+C after. |
| 4 | `find me the jira ticket about corner radius` | MCP → Atlassian, **MJT-1** surfaces |
| 5 | paste **Agent Teams prompt** below | team spawns. **Shift+Down** cycles teammates — narrate as you cycle |
| 6 | right pane: `yarn start` → browser | radius slider on rounded rectangles. Draw one, drag the slider. |

## Agent Teams prompt (paste at step 5)

```
Create an agent team to implement the corner radius slider from that Jira ticket. Three teammates:

- planner: read the ticket and packages/element/src/types.ts, packages/excalidraw/actions/actionProperties.tsx, packages/excalidraw/appState.ts, then write PLAN.md at repo root listing exactly which files change. Require plan approval before the others start.
- implementer: use the action-integration-agent type. Once the plan is approved, add cornerRadius to the element type, create the action and slider UI, wire AppState.
- tester: use the test-agent type. Once implementer commits, write a vitest suite (max 5 tests): cornerRadius persists, slider only shows when Rounded enabled, undo/redo works.

Wait for teammates to finish before proceeding.
```

Shift+Down to cycle. **Do NOT shift+tab to auto** — Agent Teams is incompatible with auto-perms (Adam Wolff, Mar 3). Approve each prompt manually; it's part of the show.

## Fallback (if team doesn't spawn)

Paste `jira-ticket.txt`, then: `implement this — use the action-integration-agent for the feature and test-agent for tests`. Proven subagent route. **Have the screen recording from your dry-run open in another window** as second fallback.

## Reset

`clean up the team` → `/clean-demo` → `tmux kill-session -t sg`

## Files

```
.claude/
├── agents/       action-integration-agent.md, test-agent.md (teammate types)
├── commands/     clean-demo.md, demo-pr.md
├── skills/       excalidraw-test-patterns/, _sage-brand-disabled/ (parked)
└── settings.local.json
```
