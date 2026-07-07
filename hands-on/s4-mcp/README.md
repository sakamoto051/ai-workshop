# S3 ハンズオン: MCP

## 準備

```bash
mkdir -p /tmp/mcp-sandbox
```

## 課題 #1: Filesystem MCP (10 分)

このディレクトリの `.agents/mcp_config.json.example` を参考に、
`~/.gemini/antigravity-cli/mcp_config.json` (またはこのディレクトリの `.agents/mcp_config.json`) に
Filesystem サーバを登録する。

`agy` 起動後:

```
/mcp
```

で `filesystem` が `connected` になっていればOK。

依頼:

> サンドボックス (/tmp/mcp-sandbox) 内に note.md を作って、
> 今日の TODO を 3 つ書いて

`ls /tmp/mcp-sandbox/` で結果確認。

## 課題 #2: GitHub MCP (15 分)

### トークン準備

GitHub > Settings > Developer settings > Personal access tokens
- スコープは `public_repo` のみ（演習用）
- 環境変数に設定: `export GITHUB_TOKEN=ghp_...`

### 設定追加

`.agents/mcp_config.json.example` の `github` ブロックを有効化。

### 依頼例

- 「`google-antigravity/antigravity-cli` の open issue を 5 件、タイトルと番号だけ一覧して」
- 「最近マージされた PR のうち、ドキュメント変更だけのものを探して」

## 比較演習（任意）

同じ設定を **Codex** (`~/.codex/config.toml`) または
**Claude Code** (`claude mcp add ...`) でも追加し、同じ依頼を実行してみる。

設定フォーマットは違うが、エージェント側の使用感は揃っているはず。
