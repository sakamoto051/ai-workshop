---
marp: true
theme: default
paginate: true
header: 'AI エージェント入門ワークショップ'
footer: 'S5: Hooks + 安全運用'
---

# S5. Hooks + 安全運用
## エージェントを **信頼できる** 形に整える

---

## 本日のフロー (60 分)

| 時間 | パート |
|---|---|
| 0-5 | イントロ + 今日の Before/After |
| 5-30 | 概念解説 (Hooks / 自動承認 / サンドボックス / Plan mode) |
| 30-35 | 講師デモ (ガードレール発動) |
| 35-55 | ハンズオン (3 種のフック実装) |
| 55-60 | 3 製品比較 + まとめ |

> S5 は **講義パートが重め**。安全運用の前提が多いため。

---

## このセッションのゴール

- Hooks の使いどころを 3 つ挙げられる
- 自動承認 / サンドボックスの違いと使い分けを理解する
- 「LLM の出力を信じすぎない」運用を仕組みで担保できる

---

## 今日の Before / After

### インシデント調査 (監査ログあり版)

| | Before (ログなし) | After (Hooks で監査) |
|---|---|---|
| 「何をしたか」の追跡 | 記憶頼り | `audit.jsonl` で全記録 |
| 事故時の根本原因特定 | 困難 | コマンド単位で時系列 |
| チームでの共有 | 口頭 | ファイル共有 |

→ **Hooks** を仕込むだけで「行動の見える化」ができる

---

## Hooks とは

> エージェントのライフサイクル イベントに対して、**任意のコマンド** を実行させる仕組み

代表的なイベント:

| イベント | タイミング |
|---|---|
| `PreToolUse` | ツール呼び出し直前 |
| `PostToolUse` | ツール呼び出し直後 |
| `UserPromptSubmit` | ユーザ入力直後 |
| `Stop` | セッション終了直前 |
| `SessionStart` | セッション開始時 |

---

## 3 つの定番ユースケース

### 1. ガードレール
危険なコマンド (`rm -rf /`) を **実行前にブロック**

### 2. 自動整形
ファイル編集の **直後に `prettier` / `ruff format`** を流す

### 3. 監査ログ
全ツール呼び出しを **JSON で記録**

→ 「LLM の出力を信じすぎない」ための仕掛け

---

## Claude Code の Hooks 設定例

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash",
        "hooks": [{ "type": "command",
                    "command": ".claude/hooks/block-dangerous.sh" }] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|Write",
        "hooks": [{ "type": "command",
                    "command": ".claude/hooks/format.sh" }] }
    ]
  }
}
```

---

## Antigravity CLI の Hooks

`.agents/hooks.json`:

```json
{
  "block-dangerous": {
    "PreToolUse": [
      { "matcher": "run_command",
        "hooks": [{ "type": "command",
                    "command": ".agents/hooks/block-dangerous.sh" }] }
    ]
  },
  "format-files": {
    "PostToolUse": [
      { "matcher": "write_file|replace",
        "hooks": [{ "type": "command",
                    "command": ".agents/hooks/format.sh" }] }
    ]
  }
}
```

※ 仕様は発展中。最新ドキュメントを参照。

---

## ハンズオン #1: 危険コマンドのブロック (15 分)

`hands-on/s5-hooks/.agents/hooks/block-dangerous.sh`（用意済み）:

```bash
#!/usr/bin/env bash
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.command // empty')
if [[ "$CMD" =~ rm[[:space:]]+-rf|:\(\)\{.*\}: ]]; then
  echo '{"decision": "deny", "reason": "危険コマンドをブロックした"}'
  exit 0
fi
echo '{"decision": "allow"}'
```

`agy` 起動 → 「`rm -rf /tmp/test` 実行しろ」と頼んでブロックを確認。

---

## ハンズオン #2: 自動整形 + 監査 (15 分)

`PostToolUse` で 2 つを実行:

1. **整形**: ファイル編集後に `ruff` / `prettier` を実行
2. **監査ログ**: `.agent-log/audit.jsonl` に追記

セッション後:

```bash
cat .agent-log/audit.jsonl | jq .
```

→ 「何のツールがどんな引数で呼ばれたか」を後追いできる。

---

## 自動承認モード

各 CLI には「人間の確認を省く」モードがある。

| 製品 | フラグ | 効果 |
|---|---|---|
| Antigravity CLI | (YOLO 相当) | 確認なしで実行 |
| Codex CLI | `--full-auto` | サンドボックス内で自動実行 |
| Claude Code | `--dangerously-skip-permissions` | 全許可 |

**便利だが危険**。次のスライドで使い分けを整理。

---

## 主流トピック: Plan モード

> **「いきなり書かせず、まず計画を立てさせる」**

各製品で実装が進む:

- **Claude Code**: `/plan` で計画モード突入。承認後に実装
- **Codex CLI**: `--ask-for-approval` 系オプション
- **Antigravity CLI**: 計画的応答を促すプロンプティング + 拡張で対応

**フロー**:

```
1. 依頼 → エージェントが計画を提示
2. 人間がレビュー (実装前に介入できる)
3. 承認 → 計画通りに実装
```

→ **大きな変更ほど効く**。承認のオーバーヘッドを払う価値あり。

---

## Plan モードと自動承認は逆方向、ではない

セットで使うのが理想:

```
[計画立案] → 人間が承認 → [実装フェーズで自動承認] → Hooks/サンドボックス
```

- **計画段階**: 人間が責任を持って判断 (頭を使う)
- **実装段階**: 単純作業はエージェントに任せる (時間を使う)

「**思考は人間、作業はエージェント**」の分業。

---

## サンドボックスの考え方

**Codex は「サンドボックスで囲って自動承認を許す」設計** が秀逸:

- macOS: Seatbelt
- Linux: Landlock
- ファイル書き込み範囲を強制

**Antigravity / Claude も同等思想あり** だが、Codex が一番強い。

→ 自動承認は **隔離環境で** が鉄則

---

## 💡 リテラシー Tip #5

> **「LLM を信頼するな、手順を信頼しろ」**

- LLM 自体は確率的 → 100% 正しい出力は保証されない
- 「**正しい出力しか通さない手順**」を組む = 安全運用
- Hooks + サンドボックス + テスト の **多層防御** がよい

「便利だから自動承認」ではなく「**安全網があるから自動承認**」の順序。

---

## 自動承認の使い分け早見表

| シーン | 推奨 |
|---|---|
| 本番リポジトリ | 手動承認 |
| 個人サンドボックス | YOLO OK |
| CI / 自動化 | サンドボックス + 自動承認 |
| 重要な変更 (DB マイグレーション等) | 手動承認 + ペアレビュー |

---

## ハンズオン #3 (任意): Claude Code Hooks との比較 (10 分)

同じ「危険コマンド ブロック」を Claude Code でも実装してみる。

- 設定キー名: `PreToolUse` (大文字始まり)
- matcher は正規表現
- `.claude/settings.json`

→ **形は違うが概念は同じ** ことを体感

---

## 設計の指針

- フックは **短く・速く** (秒単位)
- ブロック時は **理由を返す** → LLM が別手段を試せる
- 自動整形は **冪等** に
- ログには **機密を残さない**
- フック自体に **テスト** を書くのが理想

---

## 3 製品の Hooks / 安全性対比

| 観点 | Antigravity | Codex | Claude Code |
|---|---|---|---|
| 任意コマンド Hooks | ◯ | △ | ◯ (豊富) |
| イベント種別 | 数種 | 限定的 | 多種 |
| サンドボックス | △ | ◎ | △ |
| 自動承認の安全網 | Hooks 中心 | サンドボックス中心 | Hooks + 権限設定 |

→ **強い Hooks = Claude Code**、**強いサンドボックス = Codex**

---

## まとめ

- Hooks = **挙動への割り込み** (ガードレール / 整形 / 監査)
- 自動承認は **安全網とセットで**
- 「LLM を信頼するな、手順を信頼しろ」
- Codex / Claude / Antigravity は **思想の重心が違う**、目的に応じて選ぶ

次回 (S6): すべてを組み合わせた **総合演習 + ROI 測定**

---

## 参考

- Claude Code Hooks ドキュメント
- Antigravity CLI Hooks ドキュメント (最新を要確認)
- Codex CLI サンドボックス仕様
