# S5 ハンズオン: Sub-agents

## 前提

Claude Code をこのディレクトリ（`hands-on/`）で起動して進める。
`.claude/agents/researcher.md` は用意済み。

## 課題 #1: 用意済み Subagent への委譲 (10 分)

Claude Code を起動し、以下を依頼する:

> このリポジトリの認証処理がどのファイルに実装されているか調べて

- `researcher` サブエージェントが呼ばれることを確認する
- メインの会話には最終的な要約だけが残ることに注目する

## 課題 #2: 独自 Subagent の作成 (10 分)

`.claude/agents/reviewer.md` を新規作成する:

```markdown
---
name: reviewer
description: コード変更のレビューを頼まれたときに使う。
tools: Read, Grep, Glob
---

あなたはシニアエンジニアとしてコードレビューを行う。
- セキュリティ上の懸念
- エラーハンドリングの抜け
- 命名や責務分割の妥当性
の3観点で指摘すること。実装の修正は行わない。
```

作成後、次を依頼する:

> sample-repo/src/backend/auth.py をレビューして

→ `reviewer` が呼ばれ、`tools` に書き込み系がないため指摘のみで済むことを確認する。

## 課題 #3: 並列委譲を体感する (15 分)

`researcher.md` を参考に、以下 2 つの Subagent を新規作成する:

- `.claude/agents/frontend-researcher.md`（`sample-repo/src/frontend/` のみ調査対象とする description にする）
- `.claude/agents/backend-researcher.md`（`sample-repo/src/backend/` のみ調査対象とする description にする）

作成後、次を依頼する:

> フロントエンドとバックエンドを同時に調査して、それぞれの責務をまとめて

→ 2 つの Subagent が並行して起動し、最後に統合レポートが出てくる流れを確認する。

## 課題 #4 (任意): ツール制限による事故防止

> reviewer にレビューだけでなく、直接コードも直させて

と依頼し、`tools` に `Edit` / `Write` がない `reviewer` は書き込めないことを確認する。

## 比較演習

Antigravity CLI / Codex CLI でも同様の「役割分担」ができるか調べてみる。
Claude Code ほど明示的な Subagent 定義機構を持つとは限らない点に注目する。
