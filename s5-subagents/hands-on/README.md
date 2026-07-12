# S5 ハンズオン: Sub-agents (シンプルなエージェント版)

## 前提

- Antigravity CLI (`agy`) をこのディレクトリ（`hands-on/`）で起動して進める。
- `.agents/agents/` 配下には `orchestrator` / `frontend_researcher` / `backend_researcher` の3つの Subagent が用意済み（`<エージェント名>/agent.md` というディレクトリ形式で配置する）。
- 詰まったら `answer-key/` に完成形の Subagent 定義があるので参考にしてよい。
- **シンプルなエージェント**は、`.agents/agents/<name>/agent.md` に定義ファイルを配置するだけで `agy` に自動認識されます（プラグインのようなインストール手順は不要です）。

## ハンズオン #1: 独自 Subagent の作成 (8 分)

1. `.agents/agents/reviewer/agent.md` を新規作成する（ディレクトリごと作成が必要）:

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

※ 保存するだけで自動的に有効化されます。インストールコマンドは不要です。

2. `agy` を起動して次を依頼する:

> sample-repo/src/backend/ をレビューして

→ `reviewer` が呼ばれ、`tools` に書き込み系がないため指摘のみで済むことを確認する。
指摘が3観点に沿っているか、答え合わせは `answer-key/reviewer/agent.md` を参照。

## 講師デモ + ハンズオン #2: 並列委譲を体感する (15 分)

`orchestrator` / `frontend_researcher` / `backend_researcher` の3つは、このディレクトリに**すでに用意済み**（自分で作成する必要はない）。

1. まず講師が以下を実行し、動作を解説する:

```bash
./run_prompt.sh
```

- `/agents` パネルで `frontend_researcher` と `backend_researcher` が**並行**に起動する様子を確認する
- メインの会話には `orchestrator` からの**統合レポートのみ**が残ることに注目する

2. 続けて**全員が自分のターミナルで**同じコマンドを実行する:

```bash
./run_prompt.sh
```

- 親 ➔ `orchestrator` ➔ `frontend_researcher` / `backend_researcher` という3階層の自動連携を自分の目で確認する。
- `ctrl+j` や `ctrl+k` などのショートカットキーを使って、サブエージェントのログ切り替えや許可承認を体験する。
- エージェント定義の中身は `.agents/agents/orchestrator/agent.md` などを開いて確認してよい。

## ハンズオン #3 (任意・時間が余れば): ツール制限による事故防止

> reviewer にレビューだけでなく、直接コードも直させて

- と依頼し、`tools` に `Edit` / `Write` がない `reviewer` は書き込めないことを確認する。

## 比較演習

- Claude Code / Codex CLI でも同様の「役割分担」ができるか調べてみる。
- それぞれの製品で Subagent の定義方法（設定ファイルやプロンプト指示）にどのような違いがあるかに注目する。
