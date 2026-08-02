---
marp: true
theme: workshop
paginate: true
header: 'AI エージェント入門ワークショップ'
footer: '第1回: AI Agent の全体像 + コンテキスト管理'
---

<!-- _class: hero -->

# 第1回. AI Agent の全体像 + コンテキスト管理
## AIエージェントの基本とコンテキストの扱い方を掴む

---

## ワークショップ全体のロードマップ

<style scoped>
table { font-size: 22px; }
td, th { padding: 8px 12px; }
</style>

| # | テーマ | 概要 |
|---|---|---|
| **第1回** | **AI Agent の全体像 + コンテキスト管理** | エージェントの基本とコンテキスト管理を掴む |
| 第2回 | Skills | よく使う手順を再利用する |
| 第3回 | MCP | AI のできることを増やす |
| 第4回 | Subagents | 重い作業を別の頭脳に任せる |

---

## 本日のフロー

<!-- visual overflow チェック(Playwright)で確認する。番号付きリストをフロー図解に置き換えている -->
<!-- ignore-layout -->

<div class="flow grid-3">
<div class="flow-step"><span class="flow-num">1</span><span class="flow-label">AI Agent (Coding Agent) とは何か</span></div>
<div class="flow-step"><span class="flow-num">2</span><span class="flow-label">Antigravity CLI (前Gemini CLI) セットアップ・デモ</span></div>
<div class="flow-step"><span class="flow-num">3</span><span class="flow-label">コンテキスト管理とは何か</span></div>
<div class="flow-step"><span class="flow-num">4</span><span class="flow-label"><code>AGENTS.md</code> 設計 + プロンプト設計</span></div>
<div class="flow-step"><span class="flow-num">5</span><span class="flow-label">ハンズオン</span></div>
<div class="flow-step"><span class="flow-num">6</span><span class="flow-label">まとめ</span></div>
</div>

---

## このセッションのゴール

1. AI Agent (Coding Agent) とは何かを説明できる
2. Antigravity CLI (他ツール可) をセットアップし、基本操作を体験する
3. コンテキスト管理がもたらす効果を知り、`AGENTS.md` でルールを設定できる
4. プロンプト改善で消費トークンを削減できる

---

## AI Agent とは

<!-- visual overflow チェック(Playwright)で確認する。箇条書きをカード形式の図解に置き換えている -->
<!-- ignore-layout -->

AI Agent = **LLM（頭脳）+ ツール呼び出し + 自律ループ** の3要素

<div class="cards" style="--cols:3;">
<div class="card"><span class="card-title">LLM（頭脳）</span><span class="card-desc">推論・判断の中心。次に何をすべきか考える（GPT-5.6、Claude Sonnet 5 など）</span></div>
<div class="card c-accent"><span class="card-title">ツール呼び出し</span><span class="card-desc">ファイル編集・コマンド実行・API 呼び出しで外部環境と連携する</span></div>
<div class="card c-warm"><span class="card-title">自律ループ</span><span class="card-desc">一度の応答で終わらず、完了するまで複数ステップを反復する</span></div>
</div>

---

## LLM と AI Agent の違い

<style scoped>
table {
  font-size: 24px;
}
td, th {
  padding: 6px 10px;
}
</style>

| | LLM | AI Agent |
|---|---|---|
| 入力 | 渡された情報（テキスト・画像など） | ＋ ファイルや会話履歴等 に自らアクセス |
| 出力 | テキスト | ファイル編集・コマンド実行・API 呼び出し |
| ループ | 単発 | 完了まで複数ステップ自律反復 |
| 検証 | 人間がやる | 自分でテスト・lint を実行 |

**LLM ＝ 聞いたことに答えてくれる**
**AI Agent ＝ 頼んだことをやり遂げてくれる**

---

##  AI エージェントの主要リスクと対策

<!-- visual overflow チェック(Playwright)で確認する。5つのリスクをカード形式の図解に置き換えている -->
<!-- ignore-layout -->

<style scoped>
.cards .card-desc strong { color: var(--w-primary-dark); }
</style>

エージェントは自律的に動くため、チャット型のLLMとは異なるリスクが存在する。

<div class="cards" style="--cols:3;">
<div class="card c-danger"><span class="card-title">破壊的実行</span><span class="card-desc">不用意な <code>rm -rf</code> 等による意図しない書き換え<br><strong>対策:</strong> 実行前の人間承認、サンドボックス化</span></div>
<div class="card c-danger"><span class="card-title">機密情報の流出</span><span class="card-desc"><code>.env</code>や秘密鍵を外部 LLM に送信<br><strong>対策:</strong> AI用の読み込み除外設定</span></div>
<div class="card c-danger"><span class="card-title">間接プロンプト<br>インジェクション</span><span class="card-desc">外部Web/ファイルに仕込まれた指示の実行<br><strong>対策:</strong> 未信頼データ処理時のアクション監視</span></div>
<div class="card c-danger"><span class="card-title">無限ループ・課金爆発</span><span class="card-desc">エラー修復ループによるトークン大量消費<br><strong>対策:</strong> 最大ループ回数・予算リミット</span></div>
<div class="card c-danger"><span class="card-title">ブラックボックス化</span><span class="card-desc">原理を理解しないまま変更を承認し続ける<br><strong>対策:</strong> レビューの徹底、変更理由の説明</span></div>
</div>

---

## 本ワークショップでは Antigravity CLI を使う

1. 無料枠 — 参加者全員が同じ条件で触れる
2. 準備が簡単 — Google アカウントのみ
3. SKILL / MCP / Subagents の概念は共通 — 他にも応用が効く

---

## セットアップ

```bash
# インストール
curl -fsSL https://antigravity.google/cli/install.sh | bash

# 初回起動 (Google アカウントでログイン)
agy
```

---

## デモ

「`hello.sh` を作って `Hello, agent!` を出力させて。実行して確認して」

→ ファイル編集・コマンド実行・自己検証を一連の流れで確認する

---

<!-- _class: hero -->

# コンテキスト管理とは

---

## コンテキスト = エージェントが見えている情報

- コンテキストとはエージェントが応答を生成する時に参照している入力全体
- コンテキストに収まる入力の上限がコンテキストウィンドウ
- エージェントは毎回コンテキストウィンドウの中身を読んで推測している

---

## コンテキストの中身と構造

<style scoped>
.cw-cap { text-align: center; font-size: 18px; font-weight: bold; color: var(--w-muted); margin-bottom: 6px; white-space: nowrap; }
.main-container { display: flex; gap: 50px; align-items: center; justify-content: center; margin-top: 20px; }
.cw-box { width: 340px; border: 3px solid var(--w-primary-dark); border-radius: 6px; display: flex; flex-direction: column; overflow: hidden; }
.band { padding: 12px 14px; font-size: 17px; color: #fff; }
.b-sys  { background: var(--cat-neutral); flex: 0 0 auto; }
.b-hist { background: var(--cat-warm); flex: 1 1 auto; }
.b-proj { background: var(--cat-primary); flex: 0 0 auto; }
.b-tool { background: var(--cat-danger); flex: 2 1 auto; }
.b-free { background: repeating-linear-gradient(45deg, #f8f9fc, #f8f9fc 10px, var(--w-surface) 10px, var(--w-surface) 20px); color: var(--w-muted); flex: 1 1 auto; display: flex; align-items: center; justify-content: center; border-top: 2px dashed var(--w-border); }
table { font-size: 16px; }
td, th { padding: 6px 10px; }
</style>

CLIでは /contexts で確認できる

<div class="main-container">

<div>
  <div class="cw-cap">▼ ウィンドウサイズ（上限）</div>
  <div class="cw-box" style="height: 340px;">
    <div class="band b-sys">システムプロンプト・ツール定義</div>
    <div class="band b-hist">ユーザー入力・AIの応答</div>
    <div class="band b-proj">Skills・Subagents 定義</div>
    <div class="band b-tool">ツール呼び出し</div>
    <div class="band b-free">空き</div>
  </div>
</div>

<table>
  <thead>
    <tr><th>中身</th><th>具体例</th></tr>
  </thead>
  <tbody>
    <tr><td><span style="color:var(--cat-neutral)">■</span> <b>システムプロンプト・ツール定義</b></td><td>指示・ツール定義（<code>AGENTS.md</code>含む）</td></tr>
    <tr><td><span style="color:var(--cat-warm)">■</span> <b>ユーザー入力・AIの応答</b></td><td>過去の指示と応答</td></tr>
    <tr><td><span style="color:var(--cat-primary)">■</span> <b>Skills・Subagents 定義</b></td><td>呼び出し可能な定義の読み込み</td></tr>
    <tr><td><span style="color:var(--cat-danger)">■</span> <b>ツール呼び出し</b></td><td>読込ファイル・出力等</td></tr>
  </tbody>
</table>

</div>

---

## なぜコンテキストの管理が必要なのか

<!-- visual overflow チェック(Playwright)で確認する。箇条書きをカード形式の図解に置き換えている -->
<!-- ignore-layout -->

コンテキストが荒れたまま作業を進めると、次のような問題が起きる。

<div class="cards" style="--cols:3;">
<div class="card c-danger"><span class="card-title">無駄なトークン消費</span><span class="card-desc">不要なログやキャッシュまで読み込み、余計なコストが発生する</span></div>
<div class="card c-danger"><span class="card-title">手戻りの発生</span><span class="card-desc">前提や手順が伝わらず、エラーと修正を何度も繰り返す</span></div>
<div class="card c-danger"><span class="card-title">規約を無視したコード</span><span class="card-desc">プロジェクト固有のルールが共有されず、一般論での実装になる</span></div>
</div>

コンテキストは無駄なコスト増加を防ぎ、アウトプットの質を高めるための土台になる

---

## 対策①: 不要ファイルの除外設定

<style scoped>
pre { font-size: 16px; }
</style>

> `.env` や秘密鍵を誤って読み込ませない。トークンも節約する。

- **`.gitignore` による除外** — `agy` はデフォルトで `.gitignore` を尊重し、探索対象から除外する
- **AI 専用の除外** — グローバル設定 `~/.gemini/antigravity-cli/settings.json` の `permissions.deny` で拒否する
  ```json
  {
    "permissions": {
      "deny": ["read_file(.env)", "read_file(secrets/)"]
    }
  }
  ```

---

## 対策②: `AGENTS.md` によるルールの設定

> プロジェクトのルールをファイルに集約する

<!-- visual overflow チェック(Playwright)で確認する。箇条書きをカード形式の図解に置き換えている -->
<!-- ignore-layout -->

<div class="cards" style="--cols:4;">
<div class="card"><span class="card-title">コンテキストの提供</span><span class="card-desc">プロジェクト概要・技術スタック・背景</span></div>
<div class="card"><span class="card-title">明確で具体的な指示</span><span class="card-desc">開発用コマンド、コーディング規約、AIの振る舞い</span></div>
<div class="card"><span class="card-title">例の提示</span><span class="card-desc">出力形式やコードの具体例</span></div>
<div class="card"><span class="card-title">構造化</span><span class="card-desc">見出しや区切り文字でルールを整理して記述する</span></div>
</div>

**配置場所**: 
- プロジェクト固有: `.agents/AGENTS.md`
- 共通: `~/.gemini/config/AGENTS.md`

---

## `AGENTS.md` 記述例

<style scoped>
.container { display: flex; gap: 24px; }
.col { flex: 1; }
pre { font-size: 15px; line-height: 1.3; }
</style>

<div class="container">
<div class="col">

**パターン①: 直接記述**
```markdown
# calc-cli
## コーディング規約
- unittest を使用する
- 型ヒントを必須にする
## 出力フォーマット
- diff は unified format
```

</div>
<div class="col">

**パターン②: 外部ファイル参照**
```markdown
# calc-cli
- コーディング規約: docs/coding-rules.md
- 出力フォーマット: docs/output-format.md
```

**ポイント**: 役割ごとに分割すると、関係するタスクの時だけ該当ファイルが読まれる。

</div>
</div>

---

## プロンプト設計のコツ

1. **具体的に指示する** — 対象ファイルや期待する挙動を曖昧にしない
2. **十分な文脈を与える** — 背景・制約・関連ファイルを伝える
3. **出力形式を指定する** — JSON形式、HTML形式など欲しい形を明示する
4. **例を示す** — 期待するコードスタイルや出力例を1つ見せる

---

## ハンズオン: コンテキスト管理の実践

`demo/` にて、以下の2点を中心に実行・確認する。

1. **`/context` の使い方と見方**
   - 画面表示を見ながら、コンテキスト使用量の各種カテゴリの意味を理解する。
2. **`AGENTS.md` 変更による `/context` の変化**
   - 実際に `AGENTS.md` を編集し、ファイル切り出し前後でのトークン数の変化を測定する。

---

## ① /context の使い方と見方

<style scoped>
.container { display: flex; gap: 30px; align-items: center; justify-content: center; }
.col-left { flex: 1.25; text-align: center; }
.col-right { flex: 0.75; }
.legend-list { list-style: none; padding: 0; margin: 0; }
.legend-item { margin-bottom: 10px; line-height: 1.3; }
.legend-title { font-weight: bold; color: var(--w-primary); font-size: 17px; margin-bottom: 2px; }
.legend-desc { color: var(--w-muted); font-size: 15px; }
</style>

<div class="container">
<div class="col-left">

![w:560](./images/context-1-related.png)

</div>
<div class="col-right">

<ul class="legend-list">
  <li class="legend-item">
    <div class="legend-title">User messages / Agent responses</div>
    <div class="legend-desc">ユーザーの入力とAIの返答（対話履歴）</div>
  </li>
  <li class="legend-item">
    <div class="legend-title">Tool calls</div>
    <div class="legend-desc">実行したツールのログと入出力データ</div>
  </li>
  <li class="legend-item">
    <div class="legend-title">System prompt / tools</div>
    <div class="legend-desc">システムプロンプト、ツール仕様、AGENTS.mdなど</div>
  </li>
  <li class="legend-item">
    <div class="legend-title">Skills / Subagents</div>
    <div class="legend-desc">登録されたスキル定義と起動中のサブエージェント</div>
  </li>
  <li class="legend-item">
    <div class="legend-title">Free space</div>
    <div class="legend-desc">コンテキストウィンドウ内の残りの空き容量</div>
  </li>
</ul>

</div>
</div>

---

## ② 測定比較：無関係なタスクの場合 (hello)

<style scoped>
section { padding: 40px 40px; }
.container { display: flex; gap: 20px; align-items: flex-start; justify-content: center; }
.col { flex: 1; text-align: center; font-size: 18px; }
</style>

規約を読む必要がないタスクでの比較。実行: `./run_unrelated.sh`

<div class="container">
<div class="col">
<b>分割なし</b><br>

![w:560](./images/context-1-unrelated.png)

</div>
<div class="col">
<b>分割あり</b><br>

![w:560](./images/context-2-unrelated.png)

</div>
</div>

- 分割ありは、無関係な規約をロードしないためシステムプロンプトが削減される。
- 探索プロセスも発生しないため、初期コンテキストの削減分がそのまま全体の節約に直結する。

---

## ③ 測定比較：関連タスクの場合 (API設計)

<style scoped>
section { padding: 40px 40px; }
.container { display: flex; gap: 20px; align-items: flex-start; justify-content: center; }
.col { flex: 1; text-align: center; font-size: 18px; }
</style>

規約のロードと適用が必要なタスクでの比較。実行: `./run_related.sh`

<div class="container">
<div class="col">
<b>分割なし</b><br>

![w:560](./images/context-1-related.png)

</div>
<div class="col">
<b>分割あり</b><br>

![w:560](./images/context-2-related.png)

</div>
</div>

- **測定結果**: 必要規約の探索・読み込み（ツール実行）が発生するため、単発の実行では消費量が増加する場合がある。
- **分割のメリット**: 実際の複数ターンにわたる開発において、不要な規約が毎回重複してロードされるのを防ぐ。

---

## まとめ

- AI Agent = LLM (頭脳) + ツール呼び出し + 自律ループの 3 要素
- 不要な知識を削り、必要な知識を与える
  - ファイル分割等を活用し、コンテキストの圧迫を防ぐことでパフォーマンス低下を回避する
- 推測ではなく、`/context` で状態を可視化する
  - トークンが何に消費されているか定期的に把握し、スリム化する習慣をつける

---

## ワークショップの全体像と次回予告

<style scoped>
table { font-size: 20px; }
td, th { padding: 8px 12px; }
li { font-size: 19px; }
</style>

| # | テーマ | 概要 | 状態 |
|---|---|---|:---:|
| **第1回** | **AI Agent の全体像 + コンテキスト管理** | **エージェントの基本とコンテキスト管理を掴む** | **完了** |
| 第2回 | Skills | よく使う手順を再利用する | 次回 |
| 第3回 | MCP | AI のできることを増やす | |
| 第4回 | Subagents | 重い作業を別の頭脳に任せる | |

- **次回予告: 第2回 Skills**
  - よく実行する手順やノウハウをスキルとしてAIに持たせ、再現可能にする仕組みを学ぶ。
  - スキルの活用によるコンテキストへの影響を学ぶ。
