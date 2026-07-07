# S5 ハンズオン: Hooks

## 前提

`jq` をインストールしておく:

```bash
# macOS
brew install jq
# Ubuntu/Debian
sudo apt install jq
```

整形フックを試す場合は `ruff` または `prettier` も入れておくと面白い。

## 課題 #1: 危険コマンドのブロック (15 分)

`.agents/hooks/block-dangerous.sh` に実行権限を付ける:

```bash
chmod +x .agents/hooks/*.sh
```

`.agents/hooks.json.example` を `.agents/hooks.json` (または `~/.gemini/antigravity-cli/hooks.json`) に取り込む
（または `--config` で指定する形でもOK）。

`agy` 起動 →

> `/tmp/test-dir` を `rm -rf` で消して

→ フックがブロックすることを確認。

## 課題 #2: 自動整形 (10 分)

`sample.py` をわざと汚い書式に変えるよう依頼:

> sample.py のインデントとスペースをぐちゃぐちゃに直して保存して

→ PostToolUse フックの `format.sh` が走り、自動整形される様子を確認。

## 課題 #3: 監査ログ (10 分)

セッション中の全ツール呼び出しが `.agent-log/audit.jsonl` に記録される設定。

セッション後:

```bash
cat .agent-log/audit.jsonl | jq .
```

何のツールがどの引数で呼ばれたかを振り返る。

## 比較演習

同じ「危険コマンド ブロック」を Claude Code でも実装してみる。
設定キー名（`PreToolUse` の大文字始まり、matcher の書き方）が違うことに注目。
