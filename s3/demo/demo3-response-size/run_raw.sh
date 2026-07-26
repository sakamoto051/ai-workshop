#!/bin/bash
# 【比較実験】戻り値を絞り込まないツールを呼ばせ、直後の Context Usage を見る

echo "======================================================"
echo "🐘 【全部盛り】get_weather_raw を呼ばせます"
echo "======================================================"
echo "前提: .agents/mcp_config.json の絶対パスを自分の環境に書き換え済みであること"
echo "      サーバーは agy が自動起動するので、手動で node を実行する必要はない"
echo "実行コマンド: agy -i \"検索やファイル読み込みはせずに、get_weather_raw ツールだけを…\""
echo "      巨大な戻り値は CLI がファイルへ退避し、モデルが Read で読み戻す（正常な動作）"
echo "見るもの: 応答直後の Context Usage（合計 / System tools / Tool calls）"
echo "※ 42変数×30日分・約 146,000 文字の JSON が返る"
echo ""

SERVER=$(sed -n 's/.*"\(\/.*response-size-server\.js\)".*/\1/p' .agents/mcp_config.json)
if [ ! -f "$SERVER" ]; then
  echo "⚠ .agents/mcp_config.json の絶対パスが見つかりません: $SERVER"
  echo "  自分の環境のパスに書き換えてから再実行してください。"
  exit 1
fi
if [ ! -d "$(dirname "$SERVER")/node_modules" ]; then
  echo "⚠ 依存関係が未インストールです。先に次を実行してください:"
  echo "  cd $(dirname "$SERVER") && npm install"
  exit 1
fi

agy -i "検索やファイル読み込みはせずに、get_weather_raw ツールだけを使って東京の天気を取得して。"
