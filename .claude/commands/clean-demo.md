---
description: Reset repository to demo checkpoint and clean all changes while preserving .claude folder
---

Reset the repository to a clean demo state by:

1. Checking out the master branch
2. Performing a hard reset to the checkpoint-claude-working commit
3. Removing CLAUDE.md if it exists
4. Cleaning all untracked files and directories EXCEPT the .claude folder
5. Removing all build artifacts to prevent stale builds
6. Performing a clean reinstall of all dependencies
7. Removing the Atlassian MCP server (so it can be re-added live during demo)
8. Creating and checking out a new demo branch with timestamp
9. Verifying the repository is clean and ready

Execute these commands in sequence:

```bash
git checkout master
git reset --hard checkpoint-claude-working
rm -f CLAUDE.md
git clean -fd -e .claude
yarn rm:build
yarn clean-install
claude mcp remove atlassian 2>/dev/null || true
git checkout -b demo-$(date +%Y%m%d-%H%M%S)
git status
```

After completion, confirm the repository is in a clean state, on a new demo branch, with fresh dependencies and no build artifacts. The repo is ready for `yarn start` and PR demos.
