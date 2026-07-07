#!/usr/bin/env bash
# 全ツール呼び出しを JSON Lines で記録する PostToolUse フック。
set -e
mkdir -p .agent-log
{
  cat
  echo
} >> .agent-log/audit.jsonl
