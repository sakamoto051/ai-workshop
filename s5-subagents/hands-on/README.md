# S5 ハンズオン: Sub-agents

## 前提

- Antigravity CLI (`agy`) をこのディレクトリ（`hands-on/`）で起動して進める。
- プラグイン `.agents/plugins/hands-on-plugin/` 内に、定義ファイル `.agents/plugins/hands-on-plugin/agents/researcher.md` が用意済み。
  （※プラグインが認識されるためにマーカーファイル `plugin.json` も配置されています）
- 詰まったら `answer-key/` に完成形の Subagent 定義があるので参考にしてよい。

### 準備：プラグインのインストール
作業を始める前に、定義したプラグインを有効化するため、以下のコマンドでインストールを実行してください。
```bash
agy plugin install .agents/plugins/hands-on-plugin
```

## ウォームアップ（任意・講師デモの再現）

プラグインがインストールされた状態で `agy` を起動し、以下を依頼する:

> このリポジトリの認証処理がどのファイルに実装されているか調べて

- `researcher` サブエージェントが呼ばれることを確認する
- メインの会話には最終的な要約だけが残ることに注目する
- `/agents` コマンドでアクティブな Subagent の一覧や詳細ログを確認してみる

## ハンズオン #1: 独自 Subagent の作成 (8 分)

1. `.agents/plugins/hands-on-plugin/agents/reviewer.md` を新規作成する:

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

2. 以下のコマンドを実行して、変更したプラグインを再インストール（有効化）します。
```bash
agy plugin install .agents/plugins/hands-on-plugin
```

3. `agy` を起動して次を依頼する:

> sample-repo/src/backend/ をレビューして

→ `reviewer` が呼ばれ、`tools` に書き込み系がないため指摘のみで済むことを確認する。
指摘が3観点に沿っているか、答え合わせは `answer-key/reviewer.md` を参照。

## ハンズオン #2: 並列委譲を体感する (12 分)

1. `researcher.md` を参考に、以下 2 つの Subagent をプラグインディレクトリ内に新規作成する:
   - `.agents/plugins/hands-on-plugin/agents/frontend-researcher.md`（`sample-repo/src/frontend/` のみ調査対象とする description にする）
   - `.agents/plugins/hands-on-plugin/agents/backend-researcher.md`（`sample-repo/src/backend/` のみ調査対象とする description にする）

2. 変更を反映するため、プラグインを再インストールします。
```bash
agy plugin install .agents/plugins/hands-on-plugin
```

3. `agy` を起動して次を依頼する:

> フロントエンドとバックエンドを同時に調査して、それぞれの責務をまとめて

- 2 つの Subagent が並行して起動する様子を `/agents` パネルで確認する。
- `ctrl+j` や `ctrl+k` などのショートカットキーを使って、サブエージェントのログ切り替えや許可承認を体験する。
- 答え合わせは `answer-key/frontend-researcher.md`, `answer-key/backend-researcher.md` を参照。

## ハンズオン #3 (任意・時間が余れば): ツール制限による事故防止

> reviewer にレビューだけでなく、直接コードも直させて

と依頼し、`tools` に `Edit` / `Write` がない `reviewer` は書き込めないことを確認する。

## 比較演習

Claude Code / Codex CLI でも同様の「役割分担」ができるか調べてみる。
それぞれの製品で Subagent の定義方法（設定ファイルやプロンプト指示）にどのような違いがあるかに注目する。
