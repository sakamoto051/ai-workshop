---
tags:
  - concept
  - mcp
---
# Model Context Protocol (MCP)

## 📝 概要
Model Context Protocol (MCP) は、AI エージェントに対して**安全かつ統一された方法でデータやツール（API、ローカルファイル、データベースなど）への接続を提供する標準プロトコル**です。Anthropic社によって提唱され、現在は業界標準として様々なエージェントツール（[[02_Tools/Antigravity CLI|Antigravity CLI]]、Claude Code、Cursor など）で広く採用されています。

従来はエージェントごとに専用のツール接続ロジックを書く必要がありましたが、MCPの登場により「1つのMCPサーバーを書けば、すべての対応エージェントでそのツールが利用可能」になりました。

## ⚙️ MCP のアーキテクチャ
MCP はクライアント・サーバーモデルを採用しています。

```
+------------------+                   +------------------+
|                  |     stdio/SSE     |                  |
|    AI Client     | <===============> |    MCP Server    |
| (Antigravity/etc)|                   | (GitHub/DB/etc)  |
|                  |                   |                  |
+------------------+                   +------------------+
```

*   **MCP Client**: エージェントの実行エンジン。サーバーから提供されたツール（Tools）の定義をモデルに渡し、モデルが指定したツール実行指示をサーバーに中継します。
*   **MCP Server**: 特定の機能（例: ファイル操作、GitHub API連携、DBクエリ）に特化した軽量サービス。ツール定義をクライアントにさらし、要求に応じて処理を実行します。
*   **通信プロトコル**: 
    *   **stdio**: ローカルでの実行用。標準入出力を介してJSON-RPCで通信します。
    *   **SSE (Server-Sent Events)**: リモートサーバーやコンテナ内との通信用。HTTP経由で接続します。

## 🛠️ Antigravity CLI での設定 (`mcp_config.json`)
プロジェクトローカルでMCPサーバーを登録する場合、プロジェクトルートの `.agents/mcp_config.json` に設定します。

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/tmp/sandbox"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## 🔗 関連リンク
- [[AI Agents]]
- [[02_Tools/Antigravity CLI]]
- [[03_Guides/Security & Safety]]
