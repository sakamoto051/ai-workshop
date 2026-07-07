# トラブルシューティング

## Antigravity CLI

### `agy: command not found`
- グローバルインストールしたつもりが Node の prefix が PATH に入っていない
- 対処: `npm config get prefix` で確認し、`$PREFIX/bin` を PATH に追加

### 429 / Rate limit
- 無料枠を使い切っている可能性
- 対処: 数分待つ、または API キーへ切替

### MCP サーバが起動しない
- `agy mcp list` で登録状況を確認
- ログ: `agy --debug` で詳細出力
- パスは絶対パス、`command` には実行可能なバイナリを指定

### `AGENTS.md` が読まれていない気がする
- `/memory show` (対話中) で実際に読まれているコンテキストを確認
- ファイル名・配置（プロジェクトルート、または `~/.agy/AGENTS.md`）

## Codex CLI

### サンドボックスでファイル書き込みが失敗
- approval mode が `read-only` / `on-failure` になっている可能性
- 対処: `--full-auto` または `codex` 起動後に `/approval` で変更

### ChatGPT アカウントで認証できない
- ブラウザでの OAuth リダイレクトに失敗していることがある
- 対処: `codex logout && codex login`、または API キーに切替

## Claude Code

### 権限プロンプトが頻発する
- `.claude/settings.json` の `permissions.allow` に許可するパターンを追加
- 例: `"Bash(npm:*)", "Bash(git status)"`

### Hooks が発火しない
- `settings.json` のフォーマット間違いが多い
- 対処: `claude --debug` でフック関連のログを確認

### Skills が一覧に出ない
- `.claude/skills/<name>/SKILL.md` の frontmatter (`name`, `description`) が必須
- 対象ディレクトリで起動しているかを確認

## 全般

### プロキシ環境で繋がらない
- `HTTPS_PROXY` 環境変数を設定
- 自己署名証明書のときは `NODE_EXTRA_CA_CERTS` を指定

### 日本語が文字化け
- ターミナルのエンコーディングが UTF-8 か確認
- Windows なら `chcp 65001` または Windows Terminal 推奨
