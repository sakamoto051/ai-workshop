# セットアップガイド

各 CLI のインストールと認証手順をまとめます。**Antigravity CLI は必須**、Codex / Claude Code は比較デモを試したい人向け。

## 共通の前提

- Node.js 20+ (LTS 推奨)
- Git
- 任意のシェル (bash / zsh / fish)
- エディタ (VS Code 推奨。各 CLI が IDE 連携機能を持つ)

## Antigravity CLI

### インストール

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
agy --version
```

### 認証

初回起動時に対話的に選択。

```bash
agy
```

選択肢:

1. **Google アカウントでログイン**（推奨）
2. **Vertex AI** — GCP プロジェクト経由

### 設定ファイル

- ユーザ全体: `~/.gemini/antigravity-cli/settings.json`
- プロジェクト: `.agents/` (MCPは `mcp_config.json`、Hooksは `hooks.json` として配置)
- コンテキスト: `~/.gemini/config/AGENTS.md` / `<repo>/AGENTS.md`

## Codex CLI (OpenAI)

### インストール

```bash
npm install -g @openai/codex
# or: brew install codex
codex --version
```

### 認証

```bash
codex login              # ChatGPT アカウントで OAuth
# または環境変数
export OPENAI_API_KEY=sk-...
```

### 設定ファイル

- ユーザ全体: `~/.codex/config.toml`
- コンテキスト: `~/.codex/AGENTS.md` / `<repo>/AGENTS.md`

## Claude Code (Anthropic)

### インストール

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

### 認証

```bash
claude            # 初回起動時に対話的に Claude.ai / Anthropic Console / Bedrock / Vertex から選択
```

### 設定ファイル

- ユーザ全体: `~/.claude/settings.json`
- プロジェクト: `<repo>/.claude/settings.json` / `.claude/settings.local.json`
- コンテキスト: `~/.claude/CLAUDE.md` / `<repo>/CLAUDE.md`

## 動作確認

各 CLI で簡単な質問を投げてみる。

```bash
agy -p "今日は何月何日？"
codex exec "今日は何月何日？"
claude -p "今日は何月何日？"
```

## トラブル

→ [troubleshooting.md](troubleshooting.md)
