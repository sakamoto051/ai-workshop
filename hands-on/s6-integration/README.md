# S6 ハンズオン: 総合演習

## 課題: ミニ運用キットを組む (30 分)

仮想プロジェクト（このディレクトリの中身）に対して、
**S2 〜 S5 で学んだ機能を全部組み合わせて** 環境を整える。

## チェックリスト

- [ ] `AGENTS.md` を書く
  - プロジェクト概要
  - ビルド/テスト/lint コマンド
  - 触ってほしくない領域
- [ ] `.agents/mcp_config.json` に MCP を 1 つ以上追加
  - 例: `filesystem` を `/tmp/s6-sandbox` 限定で
  - 余裕があれば GitHub MCP を **read-only token** で
- [ ] `.agents/skills/daily-report/SKILL.md` を作る
  - 「今日触ったファイル一覧」を git ログから出して要約させる
- [ ] `.agents/hooks.json` に Hooks を追加
  - PreToolUse: 「本番 DB」への接続を含む shell をブロック
  - PostToolUse: 編集ファイルを自動整形
  - PostToolUse: 監査ログを `.agent-log/audit.jsonl` に出力

## 動作確認

`agy` 起動 →

1. `/mcp` で MCP 接続を確認
2. `/daily-report` を実行
3. 「本番 DB に接続して count(*) を取ってきて」と頼んでブロックされることを確認
4. 何か小さな修正を依頼し、自動整形と監査ログが効くことを確認

## 振り返りの問い

- 設定ファイル全体は何行になったか?
- うっかり secret を書きそうになった箇所はあったか?
- このセットを **新メンバーに 5 分で共有** できる形になっているか?

## 比較

同じセットアップを Claude Code / Codex でも構築してみると、
プロジェクトの **どこを共通化** すればチームで使えるかが見えてくる。

→ `AGENTS.md` を中心に据える戦略の検討に進める。
