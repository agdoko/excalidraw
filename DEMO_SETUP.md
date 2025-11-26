# Claude Code Demo Setup Guide

This guide covers setting up both the GitHub Action and preparing for a comprehensive local CLI demo.

---

## Part 1: GitHub Action Setup (Cloud-based PR Reviews)

### Step 1: Generate New Anthropic API Key

1. Go to: **https://console.anthropic.com/settings/keys**
2. Click **"Create Key"**
3. Name it: `Excalidraw Demo`
4. **Copy the key immediately** (it's only shown once!)
5. Save it securely

### Step 2: Add API Key to GitHub Repository Secrets

1. Go to: **https://github.com/agdoko/excalidraw/settings/secrets/actions**
2. Click **"New repository secret"**
3. Name: `ANTHROPIC_API_KEY`
4. Value: Paste your API key (starts with `sk-ant-`)
5. Click **"Add secret"**

### Step 3: Install Claude GitHub App

1. Go to: **https://github.com/apps/claude**
2. Click **"Install"**
3. Select **"Only select repositories"**
4. Choose: `agdoko/excalidraw`
5. Click **"Install"**

### Step 4: Push the Workflow File

```bash
cd /Users/arnaud/excalidraw
git add .github/workflows/claude.yml
git commit -m "Add Claude Code GitHub Action with Jira integration"
git push origin master
```

### Step 5: Test the GitHub Action

1. Create a test PR or issue
2. Add a comment: `@claude Hello! Can you access Jira ticket MJT-1?`
3. Watch Claude respond with the ticket details!

---

## Part 2: Local CLI Demo Setup

### Demo Scenario

**Jira Ticket: MJT-1**
- **Summary:** Change radius setting
- **Description:** Currently the radius of a rectangle cannot be defined. It's either rounded or sharp. We want the user to be able to adjust a variable radius with a slider.
- **Status:** To Do
- **Link:** https://arnaud-demo.atlassian.net/browse/MJT-1

### Demo Flow Overview

1. **Initialize Project** - Set up Claude Code for the Excalidraw codebase
2. **Access Jira** - Fetch and understand MJT-1 requirements via Atlassian MCP
3. **Explore Codebase** - Find relevant files for rectangle rendering and UI controls
4. **Implement Changes** - Add radius slider functionality
5. **Test Locally** - Run dev server and verify changes in browser
6. **Commit & Push** - Create git commit and push to fork
7. **Create PR** - Open PR and trigger GitHub Action review

---

## Local Demo: Detailed Steps

### 1. Initialize Claude Code Session

Open VSCode at `/Users/arnaud/excalidraw` and start Claude in the integrated terminal:

```bash
cd /Users/arnaud/excalidraw
claude
```

Then run:

```
/init
```

This will:
- Create/update `CLAUDE.md` with codebase documentation
- Generate `.claude/` directory with project-specific settings
- Set up context for the Excalidraw monorepo

### 2. Create Skills for Common Tasks

Skills are reusable prompts. Create these for your demo:

**Skill: Jira Integration** (`.claude/skills/jira.md`)
```markdown
# Jira Integration Skill

Use the Atlassian MCP to:
1. Fetch Jira tickets
2. Parse requirements
3. Link code changes to tickets
4. Update ticket status
```

**Skill: React Component Analysis** (`.claude/skills/react-analysis.md`)
```markdown
# React Component Analysis Skill

When analyzing React components in Excalidraw:
1. Check component location (packages/excalidraw/components/)
2. Review props interface
3. Check state management patterns
4. Identify event handlers
5. Look for canvas rendering logic
```

**Skill: Local Testing** (`.claude/skills/test-local.md`)
```markdown
# Local Testing Skill

To test changes locally:
1. Run: `yarn start`
2. Open: http://localhost:3000
3. Test the specific feature
4. Check browser console for errors
5. Verify no regression in other features
```

### 3. Create Hooks for Automation

Hooks trigger automatically on events. Create these:

**Pre-commit Hook** (`.claude/hooks/pre-commit.sh`)
```bash
#!/bin/bash
# Run type checking before commits
yarn test:typecheck
```

**Post-implementation Hook** (`.claude/hooks/post-implementation.md`)
```markdown
# Post-Implementation Checklist

After implementing changes:
- [ ] Run type checking
- [ ] Test in localhost
- [ ] Update CLAUDE.md if architecture changed
- [ ] Reference Jira ticket in commit message
```

### 4. Configure Sub-Agents

Sub-agents handle specific tasks. Configure in `.claude/agents/`:

**Code Explorer Agent** (`.claude/agents/explorer.md`)
```markdown
# Code Explorer Agent

Specializes in:
- Finding files by functionality
- Mapping component dependencies
- Understanding data flow
- Identifying related code sections
```

**Testing Agent** (`.claude/agents/tester.md`)
```markdown
# Testing Agent

Specializes in:
- Running local dev server
- Executing test suites
- Validating changes
- Performance testing
```

---

## Demo Script

### Part A: Local Development (10-15 minutes)

```
You: /init

Claude: [Creates CLAUDE.md, analyzes codebase structure]

You: Please access Jira ticket MJT-1 via the Atlassian MCP and explain what needs to be implemented.

Claude: [Uses mcp__atlassian__getJiraIssue to fetch MJT-1, explains requirements]

You: Now explore the codebase to find where rectangle rendering happens and where we'd add a radius slider control.

Claude: [Uses Task tool with Explore agent, finds relevant files]

You: Implement the radius slider feature based on the Jira requirements.

Claude: [Makes code changes, shows diffs in VSCode]

You: Let's test this locally. Start the dev server and verify the changes work.

Claude: [Runs yarn start, guides you through testing]

You: Looks good! Please commit these changes with a reference to the Jira ticket.

Claude: [Creates commit with message referencing MJT-1]

You: Push the changes and create a PR.

Claude: [Pushes to fork, creates PR]
```

### Part B: GitHub Action Demo (5 minutes)

```
1. Go to the PR on GitHub
2. Add comment: "@claude Please review this implementation against the Jira ticket requirements"
3. Watch Claude (via GitHub Action):
   - Fetch MJT-1 from Jira
   - Review the code changes
   - Provide feedback
   - Suggest improvements
```

---

## Key Demo Talking Points

### Local CLI Features to Highlight

1. **MCP Integration** - Seamless Jira access, no context switching
2. **Codebase Understanding** - Claude explores and maps the monorepo
3. **Interactive Development** - Real-time diffs shown in VSCode
4. **Skills & Hooks** - Reusable automation and best practices
5. **Sub-Agents** - Specialized agents for exploration, testing, etc.

### GitHub Action Features to Highlight

1. **Automated PR Reviews** - No manual setup required per PR
2. **Jira Integration in CI** - Action also has Jira access via MCP
3. **@claude Mentions** - Interactive feedback on PRs
4. **Security** - Permission validation, API key management
5. **Runs on Your Infrastructure** - GitHub runners, not Anthropic's

---

## Troubleshooting

### If GitHub Action Doesn't Trigger

- Check workflow file is on default branch (master)
- Verify Claude App is installed on the repo
- Ensure ANTHROPIC_API_KEY secret is set
- Check Action logs: https://github.com/agdoko/excalidraw/actions

### If Atlassian MCP Doesn't Work

- Verify you're logged into Atlassian: `/mcp` in Claude CLI
- Check cloudId is correct: `24a90d5f-1b22-4ac3-b420-6901c16914a9`
- Ensure ticket exists: MJT-1 in project MJT

### If Local Dev Server Doesn't Start

```bash
# Install dependencies if needed
yarn install

# Start dev server
yarn start
```

---

## Advanced Demo Extensions

### Show CLAUDE.md Evolution

Before and after `/init`, show how Claude documents the codebase structure.

### Create Custom Skill Live

During demo, create a new skill for a specific task to show extensibility.

### Chain Multiple Agents

Show how explorer → implementer → tester agents can work in sequence.

### Show Token Usage

Use `--verbose` flag to show token consumption and cost estimation.

---

## Post-Demo Cleanup

```bash
# Delete demo branch
git branch -D claude/mft-1-radius-slider

# Close test PR
# Manually close on GitHub

# Optional: Reset to upstream
git fetch upstream
git reset --hard upstream/master
```

---

## Questions Anticipated from Audience

**Q: How does Claude know about Excalidraw's architecture?**
A: Through `/init` which analyzes the codebase and creates CLAUDE.md with project context.

**Q: Does this work with private Jira instances?**
A: Yes! Atlassian MCP uses OAuth, works with both Cloud and self-hosted Jira.

**Q: What if I don't use GitHub?**
A: Claude Code works with any git repo locally. GitHub Action is optional for automation.

**Q: How much does this cost per PR review?**
A: Depends on PR size. Typical review: $0.10-$0.50. Check API usage in console.

**Q: Can Claude make mistakes in code?**
A: Yes, always review changes! Use this as a pair programmer, not autopilot.

**Q: Does this work with other tools besides Jira?**
A: Yes! MCP supports many tools: Linear, Slack, GitHub, databases, and more.
