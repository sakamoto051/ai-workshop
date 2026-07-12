# AI エージェント入門ワークショップ

開発者向けに、CLI 型 AI エージェントの基本的な使い方を学ぶワークショップ教材です。
主軸は **Antigravity CLI**。3 製品（Antigravity / Codex CLI / Claude Code）の比較は S1 のみで扱い、S2 以降は Antigravity CLI に絞って概念を深掘りします。

## 構成

1 セッション = 約 60 分。全 5 回で完結、独立して受講可能。

| # | テーマ | スライド | ハンズオン |
|---|---|---|---|
| S1 | AI Agent の全体像 + Antigravity CLI セットアップ | [s1/s1.md](s1/s1.md) | (S2 と共用) |
| S2 | コンテキスト管理 + プロンプト設計 + 基本操作 | [s2/s2.md](s2/s2.md) | [s2/demo](s2/demo) |
| S3 | Skills | [s3/s3.md](s3/s3.md) | [s3/demo](s3/demo) |
| S4 | MCP 編 | [s4/s4.md](s4/s4.md) | [s4/demo](s4/demo) |
| S5 | Subagents（ワークショップ総まとめを含む） | [s5/s5.md](s5/s5.md) | [s5/demo](s5/demo) |

### 共通セッションテンプレ (60 分)

| 時間 | パート |
|---|---|
| 0-5 | イントロ + 今日のゴール |
| 5-20 | 概念解説 |
| 20-30 | 講師デモ |
| 30-55 | ハンズオン |
| 55-60 | まとめ |

S1 はデモ重視・3 製品比較あり、S5 は演習 + 全 5 回の総まとめ、と微調整あり。


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
