---
tags:
  - tool
  - codex
---
# Codex CLI (OpenAI)

## 📝 概要
Codex CLI は、OpenAI 社のモデルをベースにしたターミナル用開発エージェントツールです。`@openai/codex` として配布されています。

## ⚙️ 各種設定ファイル

*   **グローバル設定**: `~/.codex/config.toml` (TOML 形式が採用されています)
*   **コンテキストルール**: `AGENTS.md` (プロジェクトルート)
    *   Codex は `AGENTS.md` ファイルを標準のコンテキストファイルとして読み込みます。この仕様は現在他のエージェントツールにも共通のデファクトとして広まりつつあります。
*   **カスタムプロンプト**: `~/.codex/prompts/`
    *   `.md` 形式で再利用可能なプロンプト定義（カスタムコマンド）を配置し、セッション内で実行可能です。

## 🔗 関連リンク
- [[Antigravity CLI]]
- [[03_Guides/Prompt Engineering#AGENTS.md の役割と配置]]
