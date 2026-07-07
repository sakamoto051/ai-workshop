# AI エージェント入門ワークショップ

開発者向けに、CLI 型 AI エージェントの基本的な使い方を学ぶワークショップ教材です。
主軸は **Antigravity CLI**、比較対象として **Codex CLI** と **Claude Code** を扱います。

## 構成

1 セッション = 約 60 分。独立して受講可能。各セッションは **冒頭 Before/After → 本編 → 末尾 3 製品比較表** の共通フレーム。

| # | テーマ | スライド | ハンズオン |
|---|---|---|---|
| S1 | 業務がどう変わるか + Antigravity CLI セットアップ | [slides/s1-intro.md](slides/s1-intro.md) | (S2 と共用) |
| S2 | コンテキスト管理 + プロンプト設計 + 基本操作 | [slides/s2-context.md](slides/s2-context.md) | [hands-on/s2-basics](hands-on/s2-basics) |
| S3 | Skills + Sub-agents | [slides/s3-skills.md](slides/s3-skills.md) | [hands-on/s3-skills](hands-on/s3-skills) |
| S4 | MCP 編 | [slides/s4-mcp.md](slides/s4-mcp.md) | [hands-on/s4-mcp](hands-on/s4-mcp) |
| S5 | Hooks + 安全運用 + Plan モード | [slides/s5-hooks.md](slides/s5-hooks.md) | [hands-on/s5-hooks](hands-on/s5-hooks) |
| S6 | 総合演習 + ROI 測定 + コスト追跡 + チーム導入 | [slides/s6-wrapup.md](slides/s6-wrapup.md) | [hands-on/s6-integration](hands-on/s6-integration) |

### 共通セッションテンプレ (60 分)

| 時間 | パート |
|---|---|
| 0-5 | イントロ + 今日の Before/After |
| 5-20 | 概念解説 |
| 20-30 | 講師デモ |
| 30-55 | ハンズオン |
| 55-60 | 3 製品比較 + まとめ |

S1 はデモ重視、S5 は講義重め、S6 は演習中心、と微調整あり。

## 共通ドキュメント

- [docs/setup.md](docs/setup.md) — 各 CLI のインストール・認証
- [docs/comparison.md](docs/comparison.md) — Gemini / Codex / Claude Code 機能対応表
- [docs/prompting.md](docs/prompting.md) — プロンプト設計 4 原則
- [docs/roi-cases.md](docs/roi-cases.md) — 5 つの ROI ケース集
- [docs/troubleshooting.md](docs/troubleshooting.md) — よくあるトラブル

## 事前準備（参加者向け）

- curl (Antigravity CLI インストール用)
- Git
- GitHub アカウント
- Google アカウント（Antigravity CLI ログイン用）
- 任意: OpenAI / Anthropic の API キー（比較デモ用、講師側で代用可）

詳細は [docs/setup.md](docs/setup.md) を参照。

## スライドのビルド

Marp で Markdown からスライドを生成します。

```bash
npm install
npm run slides:html      # HTML 出力 (dist/)
npm run slides:pdf       # PDF 出力 (dist/)
npm run slides:watch     # ライブプレビュー (s1)
```

## ライセンス・利用について

社内・コミュニティでの利用を想定した教材です。改変・再配布は自由。
