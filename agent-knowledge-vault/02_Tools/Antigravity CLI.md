---
tags:
  - tool
  - antigravity
---
# Antigravity CLI (`agy`)

## 📝 概要
Antigravity CLI (`agy`) は、Google の AI ファースト開発プラットフォームにおける軽量なターミナル用エージェントインターフェースです。Go 言語で開発されたネイティブバイナリとして配布されており、Node.js などの前提ランタイムを必要とせず高速に動作します。

## 🚀 インストール & 起動
macOS および Linux でのインストール:

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

起動:
```bash
agy
```
※初回起動時に対話的な Google OAuth 認証フローが実行されます。

## ⚙️ 各種設定ファイル

*   **グローバル基本設定**: `~/.gemini/antigravity-cli/settings.json`
    *   使用モデルの選択（`model`: `gemini-3.5-flash` など）や自動承認ポリシー、サンドボックス設定などを記述します。
*   **グローバルプラグイン/カスタマイズ**: `~/.gemini/config/`
    *   グローバルに適用するルールファイル `AGENTS.md` や、プラグイン、拡張ツールなどを配置します。
*   **プロジェクトローカル設定**: `.agents/`
    *   プロジェクトごとの接続ツールを定義する `mcp_config.json` や、イベントを検知する `hooks.json`、専用の能力を配置する `skills/` を格納します。
*   **プロジェクトルール**: `AGENTS.md` (プロジェクトルート)
    *   エージェントが開発時に従うべきコーディング規約や前提知識を明記します。

## ⌨️ TUI コマンド
エージェント実行セッション中にスラッシュコマンドを入力することで、エージェント環境を操作できます。

| コマンド | 説明 |
|---|---|
| `/mcp` | 接続中の MCP サーバーと公開ツールの確認 |
| `/skills` | ロードされている Skills の一覧 |
| `/hooks` | 登録されている Hooks の一覧 |
| `/permissions` | ツール実行権限（Allow/Deny）の設定管理 |
| `/context` | 現在エージェントのコンテキストに入っているファイルの確認 |
| `/diff` | エージェントによって変更されたコードの差分表示 |
| `/exit` / `/quit` | セッションの終了 |

## 🔗 関連リンク
- [[01_Concepts/AI Agents]]
- [[01_Concepts/Model Context Protocol (MCP)]]
- [[01_Concepts/Agent Skills]]
- [[01_Concepts/Agent Hooks]]
