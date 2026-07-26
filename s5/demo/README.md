# S5 ハンズオン: Sub-agents (シンプルなエージェント版)

## 前提

- Antigravity CLI (`agy`) をこのディレクトリ（`demo/`）で起動して進める。
- `.agents/agents/` 配下には `orchestrator` / `frontend_researcher` / `backend_researcher` の3つの Subagent が用意済み（`<エージェント名>/agent.md` というディレクトリ形式で配置する）。
- 詰まったら `answer-key/` に完成形の Subagent 定義があるので参考にしてよい。
- **シンプルなエージェント**は、`.agents/agents/<name>/agent.md` に定義ファイルを配置するだけで `agy` に自動認識されます（プラグインのようなインストール手順は不要です）。

## ハンズオン #1: 独自 Subagent の作成 (8 分)

1. `.agents/agents/reviewer/agent.md` を新規作成する（ディレクトリごと作成が必要）:

```markdown
---
name: reviewer
description: コードのレビュー・チェックを頼まれたときに使う。
tools:
  - view_file
  - grep_search
  - find_by_name
---

あなたはシニアエンジニアとしてコードレビューを行う。
- セキュリティ上の懸念
- エラーハンドリングの抜け
- 命名や責務分割の妥当性
の3観点で指摘すること。実装の修正は行わない。
```

※ 保存するだけで自動的に有効化されます。インストールコマンドは不要です。
※ `tools` は必ずYAML配列（`- view_file` のような箇条書き）で書く。カンマ区切りの1行（`tools: view_file, grep_search, find_by_name`）にすると不正なツール名として扱われ、`/agents` 一覧から消えるので注意。
※ ツール名は `/agents` パネルなどの画面表示名（Read等）ではなく、`view_file` のような内部名（snake_case）を使う。

2. プロンプトを固定した実行スクリプトを走らせる:

```bash
./run_reviewer.sh
```

中身は `agy -i "reviewer エージェントを使って、sample-repo/src/backend/ をレビューして"`。`reviewer` を名指ししている。自動委譲（`description` だけで選ばれる）は公式仕様上も発動を保証されないため、確実性を優先して名指しにしている。

→ `reviewer` が呼ばれ、`tools` に書き込み系がないため指摘のみで済むことを確認する。
指摘が3観点に沿っているか、答え合わせは `answer-key/reviewer/agent.md` を参照。

## 講師デモ + ハンズオン #2: 並列委譲を体感する (15 分)

`orchestrator` / `frontend_researcher` / `backend_researcher` の3つは、このディレクトリに**すでに用意済み**（自分で作成する必要はない）。

1. まず講師が以下を実行し、動作を解説する:

```bash
./run_orchestrator.sh
```

- `/agents` パネルで `frontend_researcher` と `backend_researcher` が**並行**に起動する様子を確認する
- メインの会話には `orchestrator` からの**統合レポートのみ**が残ることに注目する

2. 続けて**全員が自分のターミナルで**同じコマンドを実行する:

```bash
./run_orchestrator.sh
```

- 親 ➔ `orchestrator` ➔ `frontend_researcher` / `backend_researcher` という3階層の自動連携を自分の目で確認する。
- `ctrl+j` や `ctrl+k` などのショートカットキーを使って、サブエージェントのログ切り替えや許可承認を体験する。
- エージェント定義の中身は `.agents/agents/orchestrator/agent.md` などを開いて確認してよい。

## ハンズオン #3 (任意・時間が余れば): ツール制限による事故防止

> reviewer にレビューだけでなく、直接コードも直させて

- と依頼し、`tools` に書き込み系（`write_to_file` 等）がない `reviewer` は書き込めないことを確認する。

## 比較演習

- Claude Code / Codex CLI でも同様の「役割分担」ができるか調べてみる。
- それぞれの製品で Subagent の定義方法（設定ファイルやプロンプト指示）にどのような違いがあるかに注目する。
