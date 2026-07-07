#!/usr/bin/env bash
# 危険そうな shell コマンドをブロックする PreToolUse フック。
# 入力は stdin に JSON で来る前提（製品仕様は要確認）。
set -e

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.command // .args.command // empty')

# 危険パターン
if [[ "$CMD" =~ rm[[:space:]]+-rf[[:space:]]+/ ]] \
  || [[ "$CMD" =~ :\(\)\{ ]] \
  || [[ "$CMD" =~ mkfs ]] \
  || [[ "$CMD" =~ dd[[:space:]]+if= ]]; then
  cat <<JSON
{"decision": "deny", "reason": "危険コマンドをブロックしました: $CMD"}
JSON
  exit 0
fi

echo '{"decision": "allow"}'
