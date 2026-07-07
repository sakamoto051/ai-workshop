# 3 製品 機能対応表

Antigravity CLI / Codex CLI / Claude Code の主要機能の対応関係。
ワークショップを通じて埋めていく前提のリビング ドキュメント。

> 注: 各製品とも開発が活発で、最新仕様は公式ドキュメントを必ず確認すること。

## 基本機能

| 機能 | Antigravity CLI | Codex CLI | Claude Code |
|---|---|---|---|
| 配布 | `https://antigravity.google/cli/install.sh` | `@openai/codex` | `@anthropic-ai/claude-code` |
| 認証 | Google ログイン / API キー / Vertex | ChatGPT OAuth / API キー | Claude.ai / API / Bedrock / Vertex |
| 無料枠 | あり（Google ログイン時） | あり（ChatGPT Plus 等） | あり（Pro/Max プラン） |
| 既定モデル | Gemini / Vertex AI 系最新 | gpt-5 系 / codex 系 | Claude 系最新 |
| 非対話実行 | `agy -p "..."` | `codex exec "..."` | `claude -p "..."` |

## コンテキスト管理

| 機能 | Antigravity CLI | Codex CLI | Claude Code |
|---|---|---|---|
| **コンテキストウィンドウ** | **1M 〜 2M トークン** | **128K トークン** | **200K 〜 1M トークン** (※1) |
| **自動管理・特徴** | 圧倒的な広さを活かした大規模リポジトリの丸ごと解析が可能 | ウィンドウが狭いため、除外設定やターゲット指定が必須 | 制限接近時に古い会話を自動要約し、無限に会話を続ける機能を搭載 |
| プロジェクトルール | `AGENTS.md` | `AGENTS.md` | `CLAUDE.md` |
| ユーザ全体ルール | `~/.agy/config/AGENTS.md` | `~/.codex/AGENTS.md` | `~/.claude/CLAUDE.md` |
| 階層的読み込み | ◯ (ディレクトリツリーを上方向に探索) | ◯ | ◯ |
| import 構文 | `@path/to/file.md` | — | `@path/to/file.md` |
| `AGENTS.md` フォールバック読込 | 対応進行中 | ネイティブ | 対応進行中 |

> (※1) 最新モデル（Sonnet 4.6 や Opus 4.6以降）はWebチャット（有料プラン）で最大 **500K トークン**、それ以外の旧モデルは最大 **200K トークン** です。Claude Code 上で「使用クレジット（usage credits）」を有効化すると、最新モデルで最大 **1M トークン** まで拡張されます。

> **トレンド**: `AGENTS.md` が事実上の業界標準として収束しつつある。
> 実務では `AGENTS.md` を主に書き、`AGENTS.md` / `CLAUDE.md` をシンボリックリンクで揃える運用が増加。

## 拡張機能

| 機能 | Antigravity CLI | Codex CLI | Claude Code |
|---|---|---|---|
| MCP サーバ | ◯ (`mcp_config.json`) | ◯ (`config.toml`) | ◯ (`claude mcp add`) |
| カスタムコマンド/Skills | Skills (`.agents/skills/`) | プロンプト | Skills (`.claude/skills/`) |
| サブエージェント | △ (発展中) | △ (発展中) | ◯ (`.claude/agents/`) |
| Hooks | ◯ (発展中) | △ (限定的) | ◯ (`PreToolUse` 等の豊富なイベント) |
| 拡張機能パッケージ | Plugins | — | Plugins |
| **Plan / 計画モード** | △ (プロンプティング + 拡張) | ◯ (approval 設定) | ◯ (`/plan`) |
| **マルチモーダル (画像入力)** | ◎ (Gemini が特に強い) | ◯ | ◯ |
| **IDE 連携** | VS Code 拡張 | VS Code 拡張 | VS Code / JetBrains 拡張 |
| **コスト可視化** | `/stats` + ダッシュボード | `/usage` + 利用量画面 | `/cost` + サードパーティ |

## 権限・実行制御

| 機能 | Antigravity CLI | Codex CLI | Claude Code |
|---|---|---|---|
| 自動承認モード | YOLO モード | `--full-auto` / approval 設定 | `--dangerously-skip-permissions` 等 |
| サンドボックス実行 | △ | ◯ (macOS Seatbelt / Linux Landlock) | △ |
| ツール許可リスト | settings.json | config.toml | settings.json `permissions` |

## 安全運用の思想 (どこで守るか)

| 観点 | Antigravity CLI | Codex CLI | Claude Code |
|---|---|---|---|
| 主たる安全網 | Hooks + 確認プロンプト | サンドボックス | Hooks + permissions |
| 危険コマンド検知 | Hooks で実装 | サンドボックスで隔離 | Hooks で実装 |
| 監査ログ | Hooks で自前出力 | 〃 | 〃 |
| 多層防御の組みやすさ | 中 | 高 (隔離が標準) | 高 (Hooks が豊富) |

## 各製品の強み（主観・2026 年時点）

### Antigravity CLI
- **強み**: 無料枠が太い、長コンテキスト、Google エコシステム連携
- **得意**: 大規模リポジトリ調査、ドキュメント生成
- **クセ**: スタイル/挙動はやや控えめ

### Codex CLI
- **強み**: サンドボックス実行設計、approval flow が明確
- **得意**: スクリプト的なオートメーション、CI 組込み
- **クセ**: 設定は TOML、対話より exec 向き

### Claude Code
- **強み**: Skills / Hooks / Sub-agents による拡張性、UI が洗練
- **得意**: 長期間の対話的開発、複雑なリファクタ
- **クセ**: 課金プランが必要なことが多い

## 使い分けの目安

| シーン | おすすめ |
|---|---|
| 初めて触る | Antigravity (準備が軽い) |
| CI / 非対話バッチ | Codex (exec モードとサンドボックスが堅牢) |
| 長期間の本格開発 | Claude Code (Skills/Hooks で育てやすい) |
| チーム標準化 | どれでも可。`AGENTS.md` を共通化する戦略もアリ |
