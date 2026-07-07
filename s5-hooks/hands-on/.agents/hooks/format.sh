#!/usr/bin/env bash
# 編集された直後のファイルを言語に応じて整形する PostToolUse フック。
set -e

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.file_path // .args.file_path // empty')

[[ -z "$FILE" ]] && exit 0
[[ ! -f "$FILE" ]] && exit 0

case "$FILE" in
  *.py)
    command -v ruff >/dev/null && ruff format "$FILE" >/dev/null 2>&1 || true
    ;;
  *.ts|*.tsx|*.js|*.jsx|*.json)
    command -v prettier >/dev/null && prettier --write "$FILE" >/dev/null 2>&1 || true
    ;;
  *.go)
    command -v gofmt >/dev/null && gofmt -w "$FILE" >/dev/null 2>&1 || true
    ;;
esac
