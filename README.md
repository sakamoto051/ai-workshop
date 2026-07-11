# AI エージェント入門ワークショップ

開発者向けに、CLI 型 AI エージェントの基本的な使い方を学ぶワークショップ教材です。
主軸は **Antigravity CLI**、比較対象として **Codex CLI** と **Claude Code** を扱います。

## 構成

1 セッション = 約 60 分。独立して受講可能。各セッションは **冒頭 Before/After → 本編 → 末尾 3 製品比較表** の共通フレーム。

| # | テーマ | スライド | ハンズオン |
|---|---|---|---|
| S1 | 業務がどう変わるか + Antigravity CLI セットアップ | [s1-intro/s1-intro.md](s1-intro/s1-intro.md) | (S2 と共用) |
| S2 | コンテキスト管理 + プロンプト設計 + 基本操作 | [s2-context/s2-context.md](s2-context/s2-context.md) | [s2-context/hands-on](s2-context/hands-on) |
| S3 | Skills | [s3-skills/s3-skills.md](s3-skills/s3-skills.md) | [s3-skills/hands-on](s3-skills/hands-on) |
| S4 | MCP 編 | [s4-mcp/s4-mcp.md](s4-mcp/s4-mcp.md) | [s4-mcp/hands-on](s4-mcp/hands-on) |
| S5 | Sub-agents | [s5-subagents/s5-subagents.md](s5-subagents/s5-subagents.md) | [s5-subagents/hands-on](s5-subagents/hands-on) |
| S6 | 総合演習 + ROI 測定 + コスト追跡 + チーム導入 | [s6-wrapup/s6-wrapup.md](s6-wrapup/s6-wrapup.md) | [s6-wrapup/hands-on](s6-wrapup/hands-on) |

### 共通セッションテンプレ (60 分)

| 時間 | パート |
|---|---|
| 0-5 | イントロ + 今日の Before/After |
| 5-20 | 概念解説 |
| 20-30 | 講師デモ |
| 30-55 | ハンズオン |
| 55-60 | 3 製品比較 + まとめ |

S1 はデモ重視、S6 は演習中心、と微調整あり。


## 事前準備（参加者向け）

- curl (Antigravity CLI インストール用)
- Git
- GitHub アカウント
- Google アカウント（Antigravity CLI ログイン用）
- 任意: OpenAI / Anthropic の API キー（比較デモ用、講師側で代用可）


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
