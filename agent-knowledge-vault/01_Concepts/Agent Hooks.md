---
tags:
  - concept
  - hooks
---
# Agent Hooks (ライフサイクルフック)

## 📝 概要
Agent Hooks は、エージェントの**思考・実行ループの特定イベント（ツール実行前後など）に割り込み、独自のスクリプトやバリデーションを挟み込むイベント駆動型の拡張システム**です。

主に、危険なシェルコマンドの実行を自動でブロックする「安全ガードレール」や、コード編集後に自動で Linter / Formatter を実行する「開発自動化」に利用されます。

## ⚙️ ライフサイクルイベント
フックは以下のタイミングでトリガーすることができます。

*   **`PreToolUse`**: エージェントがツール（シェルコマンド実行、ファイル書き込み、MCPツールなど）を実行する**直前**に発火。実行の許可、拒否、確認を制御できます。
*   **`PostToolUse`**: ツール実行が完了した**直後**に発火。実行結果（差分）を受け取り、後処理（フォーマット、ログ記録など）を実行します。
*   **`PreInvocation` / `PostInvocation`**: モデル（LLM）への推論リクエスト前後で発火。
*   **`Stop`**: エージェントの実行が終了したときに発火。

## 🛠️ フックの設定 (`hooks.json`)
プロジェクト固有のフックは、`.agents/hooks.json` に設定します。

```json
{
  "block-dangerous": {
    "PreToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          {
            "type": "command",
            "command": ".agents/hooks/block-dangerous.sh"
          }
        ]
      }
    ]
  },
  "format-files": {
    "PostToolUse": [
      {
        "matcher": "write_file|replace",
        "hooks": [
          {
            "type": "command",
            "command": ".agents/hooks/format.sh"
          }
        ]
      }
    ]
  }
}
```

*   **matcher**: 正規表現でどのツールでフックを発火させるかを指定（`"*"` ですべてのツール）。
*   **command**: 実行するスクリプトのパス。

## 🛡️ PreToolUse フックの意思決定コントラクト
`PreToolUse` でトリガーされるスクリプトは、標準入力 (`stdin`) から JSON 形式でツール実行のコンテキストを受け取り、標準出力 (`stdout`) に以下の JSON フォーマットで判定を返す必要があります。

```json
{
  "decision": "allow" | "deny" | "ask" | "force_ask",
  "reason": "意思決定の理由（エージェントやユーザーに表示されます）"
}
```

*   `allow`: 自動的に実行を許可する。
*   `deny`: 即座に実行をブロックし、エラーを返す。
*   `ask`: ユーザーに確認プロンプトを出し、手動承認を求める。
*   `force_ask`: ユーザーの設定（常に許可など）を無視して必ず手動承認を求める。

## 🔗 関連リンク
- [[AI Agents]]
- [[03_Guides/Security & Safety]]
