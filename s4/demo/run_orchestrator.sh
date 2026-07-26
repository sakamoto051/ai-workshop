#!/bin/bash
# 【ハンズオン#2】orchestrator Subagent 経由で並列委譲を起動する

PROMPT="このリポジトリの認証処理とデータベース周りの設計について調査するため、オーケストレーター（orchestrator）サブエージェントを起動して、全体の調査を任せてください。オーケストレーターから結果が返ってきたら、その報告を提示してください。"

echo "======================================================"
echo "【ハンズオン#2】orchestrator による並列委譲の動作確認"
echo "======================================================"
echo "実行コマンド: agy -i \"$PROMPT\""
echo "見るもの: orchestrator が frontend_researcher / backend_researcher を並行起動し、"
echo "      統合結果だけがメインの会話に残ること"
echo ""

agy -i "$PROMPT"
