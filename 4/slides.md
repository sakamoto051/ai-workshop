---
marp: true
theme: workshop
paginate: true
header: 'AI エージェント入門ワークショップ'
footer: '第4回: Subagents 編'
---

<!-- _class: hero -->

# 第4回. Subagents 編
## エージェントに「別の頭脳」を任せる

コンテキストの分離と並列委譲によるスケールアウト

---

## ワークショップ全体のロードマップ

<style scoped>
table { font-size: 22px; }
td, th { padding: 8px 12px; }
</style>

| # | テーマ | 概要 |
|---|---|---|
| 第1回 | AI Agent の全体像 + コンテキスト管理 | エージェントの基本とコンテキスト管理を掴む |
| 第2回 | Skills | よく使う手順を再利用する |
| 第3回 | MCP | AI のできることを増やす |
| **第4回** | **Subagents** | 重い作業を別の頭脳に任せる |

---

## 本日のフロー

<!-- visual overflow チェック(Playwright)で確認する。番号付きリストをフロー図解に置き換えている -->
<!-- ignore-layout -->

<div class="flow grid-2">
<div class="flow-step"><span class="flow-num">1</span><span class="flow-label">概念解説 (仕組み / コンテキスト分離 / 並列実行)</span></div>
<div class="flow-step"><span class="flow-num">2</span><span class="flow-label">ハンズオン #1 (独自 Subagent 作成: reviewer)</span></div>
<div class="flow-step"><span class="flow-num">3</span><span class="flow-label">講師デモ + ハンズオン #2 (全員で並列委譲を実行)</span></div>
<div class="flow-step"><span class="flow-num">4</span><span class="flow-label">まとめ + ワークショップ全体総括</span></div>
</div>

---

## このセッションのゴール

1. Subagents が解決する課題を説明できる
   コンテキスト汚染・専門性の欠如・逐次実行のボトルネックを理解する。
2. 独自の Subagent を定義できる
   役割・利用ツール・呼び出しタイミングを設計できるようになる。
3. 並列委譲の使いどころを判断できる
   「1つのエージェントに全部やらせる」から「役割分担」への転換を体感する。

---

## なぜ1つのエージェントで完結させないのか

単一のエージェントに全工程（調査・設計・実装・レビュー）を任せると:

<!-- visual overflow チェック(Playwright)で確認する。箇条書きをカード形式の図解に置き換えている -->
<!-- ignore-layout -->

<div class="cards" style="--cols:3;">
<div class="card c-danger"><span class="card-title">コンテキストの逼迫</span><span class="card-desc">大量のファイル探索ログが会話に残り続け、上限に近づく</span></div>
<div class="card c-danger"><span class="card-title">注意力の分散</span><span class="card-desc">「今は調査中なのか実装中なのか」でLLMの役割認識がぶれる</span></div>
<div class="card c-danger"><span class="card-title">逐次実行しかできない</span><span class="card-desc">独立した調査を並行して進められず、時間がかかる</span></div>
</div>

→　Skills が「**知識の遅延注入**」なら、Subagents は「**実行主体の分離**」

---

## Subagents とは

> 特定の役割・ツール権限・システムプロンプトを持つ、**独立したコンテキストで動く子エージェント**

- 親エージェント（オーケストレーター）が必要に応じて呼び出す
- 子エージェントは自分専用のコンテキストウィンドウで作業する
- 作業完了後、要約された結果だけを親に返す（探索の途中経過は親に残らない）

---

## コンテキストの分離

<!-- visual overflow チェック(Playwright)で確認する。2カラムの箇条書きをカード枠で囲む図解に置き換えている -->
<!-- ignore-layout -->

<style scoped>
.cards .card-title { font-size: 19px; }
.cards ul { margin: 8px 0 0; padding-left: 20px; font-size: 16px; line-height: 1.5; }
.cards li { margin-bottom: 2px; }
</style>

<div class="cards" style="--cols:2;">
<div class="card">
<span class="card-title">親エージェントのコンテキスト</span>
<ul>
<li>ユーザとの会話</li>
<li>タスクの全体方針</li>
<li>Subagentへの依頼と要約結果のみ</li>
</ul>
</div>
<div class="card c-accent">
<span class="card-title">Subagent のコンテキスト</span>
<ul>
<li>役割の指示（システムプロンプト）</li>
<li>具体的なタスク（委譲時の指示）</li>
<li>探索したファイルやツールのログ</li>
<li>親エージェントには見せない作業過程</li>
</ul>
</div>
</div>

→ 親エージェントの会話は汚れず、子エージェントの探索ログは子エージェントの中で使い捨てにできる

---

## コンテキスト分離のトレードオフ (デメリット)

メリットの一方で、以下のトレードオフ（制限）に注意する必要があります:

<!-- visual overflow チェック(Playwright)で確認する。箇条書きをカード形式の図解に置き換えている -->
<!-- ignore-layout -->

<div class="cards" style="--cols:3;">
<div class="card c-warm"><span class="card-title">前提知識の不足</span><span class="card-desc">子は親のすべての会話履歴を参照できないため、意図の汲み取り漏れが起きやすい</span></div>
<div class="card c-warm"><span class="card-title">試行錯誤プロセスの損失</span><span class="card-desc">親には要約結果しか返らないため、失敗したアプローチの経緯が伝わらない</span></div>
<div class="card c-warm"><span class="card-title">コスト・オーバーヘッド</span><span class="card-desc">子の起動ごとにシステムプロンプトが消費され、トークン消費や実行時間が増える</span></div>
</div>

→ 役割を明確に定義し、適切な背景情報を渡して依頼することが重要

---

## Subagents の配置と定義

プロジェクトルートの `.agents/agents/<エージェント名>/agent.md` に配置

```
---
name: researcher
description: コードベースの調査用（ファイル探索やキーワード検索）。
---

あなたはコードベース調査の専門家である。
- 該当するファイル・関数・設定を特定し、ファイルパスと行番号付きで報告する
- 実装の修正・新規作成は行わない（読み取り専用の調査に徹する）
- 調査結果は要点を簡潔にまとめ、根拠となったコード箇所を明示する
```

- **`name`**: サブエージェントの識別子。呼び出し時に指名する名前になる
- **`description`**: 親エージェントが「いつ呼ぶか」を自動判定する起動条件の説明

---

## agent.md で使える主なフィールド

<style scoped>
table { font-size: 17px; }
td, th { padding: 4px 8px; }
p { font-size: 16px; margin: 6px 0 2px; }
</style>

| フィールド | 型 | 既定値 | 説明 |
|---|---|---|---|
| `name` | string | 必須 | サブエージェントの識別子 |
| `description` | string | 必須 | 委譲判断にplannerが使う説明文 |
| `tools` | 配列 | `[]` | 許可するツールの明示リスト |
| `mainAgent` | boolean | `true` | チャットのメインエージェントとして選択可能か |
| `subagent` | boolean | `true` | `invoke_subagent` 経由での起動を許可するか |
| `model` | string | `inherit` | 使用モデル層（inherit / flash / pro） |
| `commandExecutionPolicy` | string | `sandbox` | シェルコマンド実行ポリシー |
| `mcpServers` | 配列 | `[]` | 個別MCPサーバー設定 |
| `skills` / `plugins` | 配列 | `[]` | 依存させるスキル・プラグイン |

今回使うのは `name` / `description` / `tools` の3つのみ。他は運用を作り込む段階で使う。

出典: [Antigravity Docs, Custom Subagents Specification](https://antigravity.google/docs/subagents#custom-subagents)

---

## エージェント起動方法

1. **自動委譲**: `description` に合致するタスクだと親エージェントが判断すると自動的に起動（発動は保証されない）
2. **明示的な指示**: プロンプトで「researcher を起動して」と指定

- **`/agents` パネル**:
   - CLIで `/agents` コマンドを実行すると使用可能なエージェントの一覧を確認できる。
   - 指定することでセッションの情報を引き継いてエージェントとして処理を続けることもできる。

---

## エージェントの並列委譲

Subagents は **同時に複数呼び出せる**。

```
親エージェント ─┬→ frontend-researcher ─┐
               ├→ backend-researcher   ├→ 要約が出そろって親が統合
               └→ infra-researcher    ─┘
```

- **メリット**: 逐次の3倍かかる調査を時間短縮 / 領域ごとに役割分担が明確 / 各子のコンテキストは汚染し合わない
- **デメリット**: 子エージェントごとにトークン消費・コストが増大 / 依存タスクは並列化できない / 子エージェント間で情報共有できず重複・矛盾の恐れ

→ 逐次実行では3倍かかっていた調査が、並列化で短縮できる

---

## ハンズオン #1: 独自 Subagent の作成 (1/2)
<style scoped>
pre { font-size: 0.85em; }
</style>

`.agents/agents/reviewer/agent.md` を新規作成する:

```
---
name: reviewer
description: コードのレビュー・チェックを頼まれたときに使う。
---

あなたはシニアエンジニアとしてコードレビューを行う。
- セキュリティ上の懸念
- エラーハンドリングの抜け
- 命名や責務分割の妥当性
の3観点で指摘すること。実装の修正は行わない。
```

---

## ハンズオン #1: 独自 Subagent の作成 (2/2)
<style scoped>
li, p { font-size: 0.9em; }
</style>

作成後、動作を確認する。全員が同じ条件で試せるようプロンプトは固定してある。

- 実行ディレクトリ: `4/demo`
- 実行コマンド: `./run_reviewer.sh`
- 依頼内容: `reviewer エージェントを使って、sample-repo/src/backend/ をレビューして`

**見るポイント**
- メインの会話に `reviewer` への委譲ログが残るか
- 指摘内容が3観点（セキュリティ / エラーハンドリング / 命名・責務分割）に沿っているか

---

## ハンズオン #2: 並列委譲を体感する

```
メイン ─→ orchestrator (tools: invoke_subagent)
           ├─→ frontend_researcher
           └─→ backend_researcher

$ ./run_orchestrator.sh
```

3つの Subagent（`orchestrator` / `frontend_researcher` / `backend_researcher`）は用意済み。

- orchestrator が2つのエージェントを呼び出し、統合結果だけがメインに残る

---

## Skills との違い

<style scoped>
table { font-size: 26px; }
td, th { padding: 6px 10px; }
</style>

| | Skills | Subagents |
|---|---|---|
| 何を分離するか | **知識**（手順・ルール） | **実行主体**（コンテキストそのもの） |
| 実行コンテキスト | 親と同じコンテキストに注入 | 独立した別コンテキスト |
| 並列実行 | 不可 | 可能 |
| 向いている用途 | ルールの遅延読込 | 重い調査・専門ペルソナ・並列作業 |

→ 併用も可能: `reviewer` Subagent が内部で `review` Skill のルールに従う、など

---

## 設計の指針

<!-- visual overflow チェック(Playwright)で確認する。箇条書きをカード形式の図解に置き換えている -->
<!-- ignore-layout -->

<div class="cards" style="--cols:3;">
<div class="card"><span class="card-title">役割は1つに絞る</span><span class="card-desc">「何でも屋」は description が曖昧になり呼ばれにくい。複数の役割を持たせると「ロールドリフト」も起きやすい</span></div>
<div class="card c-accent"><span class="card-title">要約の粒度を意識する</span><span class="card-desc">親に返す結果が長すぎると分離した意味が薄れる</span></div>
<div class="card c-warm"><span class="card-title">並列化できるタスクを見極める</span><span class="card-desc">依存関係のある工程は並列に向かない</span></div>
</div>

---

## まとめ

- Subagents は実行コンテキストそのものの分離（Skills は知識の分離）
- メインの会話を汚さずに、重い調査や専門作業を任せられる
- 並列委譲で、逐次実行のボトルネックを解消できる
- 役割を絞り、ツール権限を最小化することが事故防止にもつながる

---

<!-- _class: hero -->

# ワークショップ 全体総まとめ (第1回〜第4回)

本ワークショップはこの第4回をもって完結

---

## まとめ: 各回で扱ったテーマ

<style scoped>
table { font-size: 24px; }
td, th { padding: 6px 10px; }
td:first-child, th:first-child { white-space: nowrap; }
</style>

| # | テーマ | 一言でいうと |
|---|---|---|
| 第1回 | AI Agent の全体像 + コンテキスト管理 | エージェント = LLM (頭脳) + ツール呼び出し + 自律ループ。AIに何を・どう伝えるかを数値で最適化する |
| 第2回 | Skills | よく使う手順を知識として遅延注入する |
| 第3回 | MCP | AI のできること（外部ツール・データ接続）を増やす |
| 第4回 | Subagents | 重い作業を別の実行主体に委譲し、並列化する |

---

## まとめ: 4つの技術の関係性

```
             コンテキスト管理 (第1回後半)
         全セッション共通の土台・前提
                    │
   ┌────────────────┼────────────────┐
   │                │                │
Skills(第2回)    MCP(第3回)     Subagents(第4回)
「知識」の      「できること」の  「実行主体」の
 遅延注入         拡張            分離・並列化
```

- 第1回で扱った「コンテキストを賢く使う」という発想が、第2〜4回すべての土台になっている
- Skills・MCP・Subagents は **競合ではなく併用が前提**（例: Subagent が内部で Skill やMCP ツールを使う）

---

## まとめ: 共通する設計思想

- 必要なものだけを、必要なタイミングで見せる
  （コンテキストの遅延読込 / ツールの選択的接続 / 子エージェントへの要約返却）
- 役割・権限は狭く絞る
  （プロンプトの明確化 / MCP ツールの絞り込み / Subagent の単一責務）

---

## まとめ

- 今回学んだのは Antigravity 固有の機能ではなく 共通の概念 — 自チームが使う製品でもそのまま応用できる
- 今回はコンテキストエンジニアリングの観点で扱ったが、直近はハーネスエンジニアリングやループエンジニアリングといった話題も増えている
- AIの技術進歩は著しいので、常に最新情報をキャッチアップし続けることが重要

**ご参加ありがとうございました。**
