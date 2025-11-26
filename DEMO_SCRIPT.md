# 5-Minute Claude Code Demo Script

**Objective**: Show Claude Code accessing Jira, understanding codebase, and implementing features autonomously

---

## 🎬 DEMO FLOW (5 minutes)

### **Part 1: Show the Jira Ticket** (30 seconds)

Open browser to: **https://arnaud-demo.atlassian.net/browse/MJT-1**

**Say**: "We have a Jira ticket requesting a new feature - users want to adjust rectangle corner radius with a slider, not just sharp vs rounded."

---

### **Part 2: Claude Code + MCP Integration** (2 minutes)

**In Terminal** (already in `/Users/arnaud/excalidraw`):

```bash
claude
```

**Type to Claude**:
```
Access Jira ticket MJT-1 via the Atlassian MCP and explain what needs to be implemented
```

**Say while Claude works**:
- "Claude Code connects to our Jira workspace via MCP (Model Context Protocol)"
- "No context switching needed - Claude reads the ticket directly"
- "This is the same MCP we configured for GitHub Actions"

**Show** (while Claude responds):
1. Open `.github/workflows/claude.yml` - point to MCP config
2. Show `.claude/agents/` folder - "We've set up specialized sub-agents"

---

### **Part 3: Exploring the Codebase** (1.5 minutes)

**Type to Claude**:
```
Explore the Excalidraw codebase and tell me where rectangle rendering happens and where we'd add radius controls
```

**Say while Claude works**:
- "Claude doesn't know Excalidraw - it's exploring in real-time"
- "Using the code-explorer sub-agent to map the architecture"
- "This is a monorepo with packages/ and excalidraw-app/"

**Show** (while Claude responds):
- Point to CLAUDE.md in VSCode sidebar
- "Claude documents findings here for future reference"

---

### **Part 4: GitHub Actions Integration** (1 minute)

**Open browser tab to**: **https://github.com/agdoko/excalidraw/pull/1**

**Say**:
- "We also set up Claude as a GitHub Action"
- "When developers comment @claude, it reviews code and accesses Jira automatically"
- Point to Claude's comment showing it fetched MJT-1
- "Same MCP tools, but running in CI/CD"

**Show**:
- The workflow runs in Actions tab
- "Runs on your infrastructure, not Anthropic's"

---

### **OPTIONAL Part 5: Implementation** (Skip if running low on time)

**Only do if you have time left:**

**Type to Claude**:
```
Make a simple proof-of-concept change - add a TODO comment in the rectangle code referencing MJT-1
```

**Say**:
- "For today's demo, just showing where the change would go"
- "In production, Claude would implement the full slider"
- "Can test locally, commit, and open PR"

---

## 🎯 KEY TALKING POINTS

### MCP Integration
- "MCP connects Claude to external tools - Jira, Slack, databases, etc."
- "Works locally in CLI AND in GitHub Actions"
- "OAuth for local, API tokens for automation"

### Codebase Understanding
- "No prior knowledge of Excalidraw needed"
- "Claude explores, maps dependencies, finds relevant code"
- "Documents findings in CLAUDE.md for team knowledge base"

### Sub-Agents
- "Specialized agents for different tasks"
- "Code-explorer for understanding, Jira-implementer for building"
- "Can chain agents: explore → implement → test → review"

### Autonomous Development
- "From ticket to implementation with minimal guidance"
- "Tests locally before committing"
- "References Jira ticket in commits automatically"

---

## ⚠️ FALLBACK IF ANYTHING BREAKS

**If Claude can't access Jira**:
- Show the Jira ticket yourself in browser
- Say: "Normally Claude would fetch this via MCP, but let me show you..."
- Continue with codebase exploration

**If Claude is slow**:
- Show the GitHub Action PR while waiting
- Talk through the workflow file
- Show the sub-agents folder

**If totally stuck**:
- Show DEMO_SETUP.md
- Walk through the architecture diagram
- Explain what WOULD happen in a working demo

---

## 📋 PRE-DEMO CHECKLIST

- [ ] VSCode open at `/Users/arnaud/excalidraw`
- [ ] Terminal ready in VSCode
- [ ] Browser tabs open:
  - https://arnaud-demo.atlassian.net/browse/MJT-1
  - https://github.com/agdoko/excalidraw/pull/1
- [ ] `.claude/agents/` folder visible in VSCode sidebar
- [ ] CLAUDE.md visible in VSCode sidebar
- [ ] `.github/workflows/claude.yml` ready to show

---

## 🎤 OPENING LINE

"Today I'm showing Claude Code - an AI agent that connects directly to your development tools. Watch as Claude accesses our Jira workspace, explores an unfamiliar codebase, and implements features autonomously - all from the terminal."

## 🎤 CLOSING LINE

"This same setup works locally for development and in GitHub Actions for automated reviews. MCP gives Claude access to your entire toolchain - Jira, Confluence, databases, whatever you need. Questions?"
