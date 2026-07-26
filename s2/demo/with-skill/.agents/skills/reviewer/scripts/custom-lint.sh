#!/bin/bash
# 自社専用の静的解析ツール（モック）

TARGET_FILE=$1

if [ -z "$TARGET_FILE" ]; then
  echo "Error: Target file is required."
  exit 1
fi

echo "Running Custom Security Linter on $TARGET_FILE..."
echo "------------------------------------------------"

ERRORS=0

# Paginationのチェック (limit/offsetが含まれているか簡易チェック)
if ! grep -irq "limit" "$TARGET_FILE" 2>/dev/null; then
  echo "[LINT ERROR] B001: Pagination (limit/offset) is missing in the generated code."
  ERRORS=$((ERRORS + 1))
fi

# 重複チェック(existsやfind)の簡易チェック
if ! grep -irqE "exists|findbyuser" "$TARGET_FILE" 2>/dev/null; then
  echo "[LINT WARN] B002: Idempotency check (e.g., checking if review already exists) might be missing."
fi

# any型のチェック
if grep -rq "any" "$TARGET_FILE" 2>/dev/null; then
  echo "[LINT ERROR] T001: 'any' type is used. Strict typing is required."
  ERRORS=$((ERRORS + 1))
fi

echo "------------------------------------------------"
if [ $ERRORS -gt 0 ]; then
  echo "Linter finished with $ERRORS errors."
  exit 1
else
  echo "Linter passed successfully."
  exit 0
fi
