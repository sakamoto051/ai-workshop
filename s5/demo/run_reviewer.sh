#!/bin/bash
# 【ハンズオン#1】自作した reviewer Subagent を名指しで起動する

PROMPT="reviewer エージェントを使って、sample-repo/src/backend/ をレビューして"

echo "======================================================"
echo "【ハンズオン#1】独自 Subagent (reviewer) の動作確認"
echo "======================================================"
echo "前提: .agents/agents/reviewer/agent.md を作成済みであること"
echo "実行コマンド: agy -i \"$PROMPT\""
echo "      reviewer を名指ししている（自動委譲は発動を保証されないため）"
echo "見るもの: reviewer への委譲ログと、3観点に沿った指摘"
echo "      tools がYAML配列で正しく設定されていれば、修正は行われない"
echo ""

if [ ! -f ".agents/agents/reviewer/agent.md" ]; then
  echo "⚠ .agents/agents/reviewer/agent.md が見つかりません。"
  echo "  demo/ ディレクトリで実行しているか、ファイルを作成済みかを確認してください。"
  echo "  完成形は answer-key/reviewer/agent.md にあります。"
  exit 1
fi

agy -i "$PROMPT"
