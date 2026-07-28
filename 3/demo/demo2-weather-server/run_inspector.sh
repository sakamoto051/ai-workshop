#!/bin/bash
# 【補足】MCP Inspector で、エージェントを介さず自作サーバーを直接確認する

echo "======================================================"
echo "🔍 MCP Inspector を起動します"
echo "======================================================"
echo "ブラウザでUIが開き、Tools / Resources / Prompts の各タブから"
echo "get_weather ツールや weather:// リソース、suggest-packing-list プロンプトを個別に確認できる"
echo "実行コマンド: npx @modelcontextprotocol/inspector node weather-mcp-server/index.js"
echo ""

if [ ! -d "weather-mcp-server/node_modules" ]; then
  echo "⚠ 依存関係が未インストールです。先に次を実行してください:"
  echo "  cd weather-mcp-server && npm install"
  exit 1
fi

npx @modelcontextprotocol/inspector node weather-mcp-server/index.js
