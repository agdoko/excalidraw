# Claude Code Enablement Demo (Bedrock Edition)

90-minute hands-on session for Bedrock customers.

## Session Overview

| Section | Duration | Content |
| --- | --- | --- |
| Installation | 10 min | Live install of Claude Code + Bedrock auth context |
| Context & Speed | 10 min | CLAUDE.md generation, before/after comparison |
| Feature Implementation | 40 min | Plan mode, subagents, live coding |
| Ship It | 15 min | Tests, PR creation, GitHub Actions |
| Q&A Buffer | 15 min | Questions throughout |

## Demo Script

### Part 1: Installation (10 min)

**Show fresh install in isolated environment:**

```bash
# Setup isolated environment (temp HOME)
export HOME=/tmp/claude-demo-$$
mkdir -p $HOME
export PATH=/usr/bin:/bin:/usr/local/bin

# Verify clean slate
which claude  # "not found"

# Install Claude Code
curl -fsSL https://claude.ai/install.sh | bash
source ~/.bashrc

# Verify
claude --version
```

**Explain Bedrock auth context:**

> "For Bedrock users, your IT deploys an authentication layer:
>
> 1. Install Claude Code normally (what I just showed)
> 2. IT runs the 'Claude Code with Bedrock' solution
> 3. They provide an installer that sets up an AWS profile
> 4. You run `AWS_PROFILE=ClaudeCode claude`
>
> Guide: github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock"

### Part 2: Context & Speed Demo (10 min)

Switch to pre-configured excalidraw terminal.

1. `/clean-demo` - Reset to clean state
2. `yarn start` - Show app works (round vs sharp rectangle edges)
3. Switch to Haiku model
4. "Claude, tell me about this codebase" - **SLOW** (no CLAUDE.md)
5. `/init` - Generate CLAUDE.md
6. Exit Claude, start new session
7. Same question - **FAST** (with CLAUDE.md)

### Part 3: Feature Implementation (40 min)

**Paste the feature request:**

```
Add Variable Corner Radius Control for Rectangle Elements
- Add slider to properties panel when rectangle is selected
- Only visible when "Rounded" option is enabled
- Range: 0 to min(width, height) / 2
- Real-time updates as user drags
```

1. Show plan mode activation
2. Claude explores codebase, proposes implementation
3. Show subagents in `.claude/agents/`
4. Implement feature using subagents
5. `yarn start` - Prove change works
6. Show skills folder (`.claude/skills/`)

### Part 4: Ship It (15 min)

1. Run `/demo-pr`
2. Show automated checks running
3. Show PR in GitHub
4. Show GitHub Actions triggered
5. `/clean-demo` to reset for questions

## Key Features to Highlight

- **Context awareness** - CLAUDE.md makes Claude faster
- **Plan mode** - Think before coding
- **Subagents** - Specialized agents for specific tasks
- **Skills** - Reusable knowledge/patterns
- **Slash commands** - Custom workflows (`/clean-demo`, `/demo-pr`)
- **GitHub integration** - PR creation, Actions

## NOT Covered (Bedrock limitations)

- MCP integrations (not available on Bedrock)
- Jira/Confluence connections

## Reset Between Demos

```bash
# Clean up temp install environment
rm -rf /tmp/claude-demo-*

# Reset excalidraw repo
/clean-demo
```

## Troubleshooting

If demo breaks:

1. Show docs: https://code.claude.com/docs/en/overview
2. Walk through verbally
3. Move to Q&A

## Files in This Demo

```
.claude/
├── agents/
│   ├── test-agent.md          # Vitest test writing
│   └── action-integration-agent.md  # Excalidraw actions
├── commands/
│   ├── clean-demo.md          # Reset repo
│   └── demo-pr.md             # Create PR
├── skills/
│   └── excalidraw-test-patterns/  # Test patterns
└── demo.md                    # This file
```
