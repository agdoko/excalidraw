# Excalidraw demo — runbook (Sage 101, session 2 · Apr 14)

`claude-public` 2.1.107. Agent Teams via env var (confirmed present at this version).

## Pre-flight (one-time, before screen-share)

```bash
cd ~/code/excalidraw
./reset.sh                                       # hard reset to checkpoint, fresh demo-* branch, worktrees cleared
```

**Tmux layout** — two panes side by side. Left = CC, right = app:
```bash
tmux kill-session -t sage 2>/dev/null
tmux new-session -d -s sage -c ~/code/excalidraw
tmux split-window -h -t sage -c ~/code/excalidraw
tmux send-keys -t sage:0.0 'claude-public' C-m
tmux attach -t sage
```
Bump font (⌘+). Left pane is where you live; right pane idle until step 3.

In left pane (CC):
```
/mcp           # confirm Atlassian shows ✓ Connected (HTTP one)
/model haiku   # matches session 1; switch to opus if Agent Teams misbehaves
```

## Run

| # | Do (left pane unless noted) | Check |
|---|---|---|
| 1 | `tell me about this codebase` | explores monorepo |
| 2 | `/init` | shows generated CLAUDE.md |
| 3 | right pane: `yarn start` → browser | default purple, sharp/round toggle only. Ctrl+C after. |
| 4 | `/sage-brand` | green `#00D639` lands in theme files |
| 5 | `find me the jira ticket about corner radius` | MCP → Atlassian, **MJT-1** surfaces |
| 6 | paste **Agent Teams prompt** below | team spawns. **Shift+Down** cycles teammates — narrate as you cycle |
| 7 | right pane: `yarn start` → browser | Sage green chrome + radius slider on rounded rectangles |

## Agent Teams prompt (paste at step 6)

```
Create an agent team to implement the corner radius slider from that Jira ticket. Three teammates:

- planner: read the ticket and packages/element/src/types.ts, packages/excalidraw/actions/actionProperties.tsx, packages/excalidraw/appState.ts, then write PLAN.md at repo root listing exactly which files change. Require plan approval before the others start.
- implementer: use the action-integration-agent type. Once the plan is approved, add cornerRadius to the element type, create the action and slider UI, wire AppState.
- tester: use the test-agent type. Once implementer commits, write a vitest suite (max 5 tests): cornerRadius persists, slider only shows when Rounded enabled, undo/redo works.

Wait for teammates to finish before proceeding.
```

Shift+Down to cycle. **Do NOT shift+tab to auto** — Agent Teams incompatible with auto-perms. Approve each prompt manually; it's part of the show.

## Fallback (if team doesn't spawn)

Say "let me show you the simpler subagent route instead" → paste `jira-ticket.txt`, then: `implement this — use the action-integration-agent for the feature and test-agent for tests`. Proven path. **Have last week's recording open in another window** as second fallback.

## Reset

`clean up the team` → `./reset.sh` (or `/clean-demo`) → `tmux kill-session -t sage`

## Files

```
.claude/
├── agents/       action-integration-agent.md, test-agent.md
├── commands/     clean-demo.md, demo-pr.md
├── skills/       excalidraw-test-patterns/, sage-brand/
└── settings.local.json   (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1, teammateMode: in-process)
```
