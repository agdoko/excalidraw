#!/bin/bash
set -e
cd "$(dirname "$0")"
git checkout master
git reset --hard checkpoint-claude-working
rm -f CLAUDE.md PLAN.md
git clean -fd -e .claude -e reset.sh
yarn rm:build
yarn clean-install
git checkout -b demo-$(date +%Y%m%d-%H%M%S)
git status
echo "✅ reset complete — on fresh demo branch"
