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
7. Creating and checking out a new demo branch with timestamp
8. Verifying the repository is clean and ready

Execute these commands in sequence:

```bash
# Back up public Claude Code build before any operations
PUBLIC_BUILD="$HOME/.local/share/claude/versions/2.1.31"
PUBLIC_BUILD_HOME="$HOME/.claude-public-home/.local/share/claude/versions/2.1.31"
BACKUP="/tmp/claude-public-backup-$$"
if [ -f "$PUBLIC_BUILD" ]; then cp "$PUBLIC_BUILD" "$BACKUP"; fi

git checkout master
git reset --hard checkpoint-claude-working
rm -f CLAUDE.md
git clean -fd -e .claude
yarn rm:build
yarn clean-install
# Restore public Claude Code build if overwritten
if [ -f "$BACKUP" ]; then
  for target in "$PUBLIC_BUILD" "$PUBLIC_BUILD_HOME"; do
    if [ -n "$target" ]; then
      mkdir -p "$(dirname "$target")"
      cp "$BACKUP" "$target"
      chmod +x "$target"
    fi
  done
  rm -f "$BACKUP"
fi

git checkout -b demo-$(date +%Y%m%d-%H%M%S)
git status

# Verify public build
~/.local/bin/claude-public --version 2>/dev/null && echo "Public Claude Code build: OK" || echo "WARNING: Public Claude Code build missing!"
```

After completion, confirm the repository is in a clean state, on a new demo branch, with fresh dependencies and no build artifacts. The repo is ready for `yarn start` and PR demos.
