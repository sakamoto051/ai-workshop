---
tags:
  - tool
  - claude
---
# Claude Code

## 📝 概要
Claude Code は、Anthropic 社が提供するターミナル用 AI 開発エージェントツールです。`@anthropic-ai/claude-code` として npm を通じて配布されます。

ローカルコードベースの把握能力、編集、テストの実行、Git コミットの作成などを自律的に高い精度で行うことができます。

## ⚙️ 各種設定ファイル

*   **グローバル設定**: `~/.claude/settings.json`
*   **プロジェクト設定**: `<repo>/.claude/settings.json`
*   **コンテキストルール**: `CLAUDE.md` (または `AGENTS.md`)
    *   Claude Code もプロジェクトルートにある `CLAUDE.md` をロードして、プロジェクトごとのコーディング基準などを把握します。
*   **Skills (カスタム命令)**: `.claude/skills/`
    *   Antigravity CLI と同様の Markdown 形式の Skill を持ち、自動ロードや明示呼び出しが可能です。
*   **Sub-agents**: `.claude/agents/`
    *   独自の Sub-agent 人格（プロファイル）を定義し、タスクを専門エージェントに並列で委譲する仕組みをいち早く取り入れています。

## 🔗 関連リンク
- [[Antigravity CLI]]
- [[01_Concepts/Agent Skills]]
- [[01_Concepts/Sub-agents]]
