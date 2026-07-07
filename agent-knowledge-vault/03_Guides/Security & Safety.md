---
tags:
  - guide
  - security
---
# Security & Safety (安全運用)

## 📝 概要
AI エージェントは「コードを生成する」だけでなく「実際にコマンドを実行し、ファイルを書き換える」機能を持つため、**誤動作や悪意ある生成コードの実行による深刻なリスク（ファイルの全削除、認証情報の流出など）** を伴います。

本ガイドでは、エージェントを実開発で安全に運用するためのプラクティスを解説します。

## 🛡️ 安全対策の3つの柱

### 1. 権限管理 (Permissions)
エージェントにすべてを自動実行させるのではなく、ツール実行時にユーザーの明示的な確認を求めるよう設定します。

*   **Antigravity CLI での設定 (`settings.json`)**:
    ```json
    {
      "toolPermission": "request-review",
      "allowNonWorkspaceAccess": false
    }
    ```
    *   `toolPermission` を `request-review` または `strict` に設定することで、エージェントがコマンドを実行したりファイルを編集する際に、都度TUI上で承認画面を出すことができます。
    *   `allowNonWorkspaceAccess` を `false` にすることで、ワークスペース外の無関係なローカルファイルを誤って読み書きすることを防ぎます。

### 2. イベントフックによる強制ブロック ([[01_Concepts/Agent Hooks|Agent Hooks]])
エージェントが「壊滅的なコマンド（例: `rm -rf /`）」や「機密情報を含む環境変数の露出」を伴うツール呼び出しを行おうとした際、シェルスクリプトやツールチェックプログラムによって強制的に割り込み、実行を拒否（`decision: deny`）させます。

*   **`PreToolUse` によるブロックのフロー**:
    1. エージェントが `run_command ("rm -rf /")` を計画。
    2. システムが `block-dangerous.sh` を起動し、標準入力から引数 `rm -rf /` を渡す。
    3. スクリプトが正規表現で検知し、`stdout` に `{"decision": "deny", "reason": "dangerous command blocked"}` を返して終了。
    4. エージェントはツールを実行できず、エラーとして処理されます。

### 3. サンドボックス実行 (Sandboxing)
エージェントが実行するシェルコマンドを、ホストOSから隔離されたセキュアなコンテナや仮想環境（Docker, Landlock, Seatbelt など）の内部で実行させます。万が一エージェントが悪意あるコードを実行したり無限ループに陥ったりしても、ホストマシンのデータやシステムは保護されます。

## 🔗 関連リンク
- [[01_Concepts/Agent Hooks]]
- [[02_Tools/Antigravity CLI]]
