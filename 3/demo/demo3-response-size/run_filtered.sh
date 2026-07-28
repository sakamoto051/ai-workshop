#!/bin/bash
# 【比較実験】戻り値を絞り込んだツールを呼ばせ、直後の Context Usage を見る

echo "======================================================"
echo "🪶 【絞り込み】get_weather_filtered を呼ばせます"
echo "======================================================"
echo "前提: .agents/mcp_config.json の絶対パスを自分の環境に書き換え済みであること"
echo "      サーバーは agy が自動起動するので、手動で node を実行する必要はない"
echo "実行コマンド: agy -i \"検索やファイル読み込みはせずに、get_weather_filtered ツールだけを…\""
echo "      run_raw.sh とはツール名以外まったく同じ文言（比較の条件を揃えるため）"
echo "見るもの: 応答直後の Context Usage（合計 / System tools / Tool calls）"
echo "※ run_raw.sh と同じAPIリクエストを発行するため、応答まで数秒かかる"
echo "※ run_raw.sh は必ず【新規会話】で実行して比較すること"
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

agy -i "検索やファイル読み込みはせずに、get_weather_filtered ツールだけを使って東京の天気を取得して。"
