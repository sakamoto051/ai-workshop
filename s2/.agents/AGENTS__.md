# プロジェクト全体ルール (AGENTS.md)

これはすべてのAIエージェントに適用されるルールブックです。
詳細な規約は役割ごとに以下のファイルへ分割されています。**該当するタスクを行うときだけ、対応する規約ファイルを読み込んでください。**

## 規約ファイル一覧

| 読むタイミング | 規約 | ファイル |
| :--- | :--- | :--- |
| 機能追加・新規実装 | アーキテクチャ標準規約 | `.agents/docs/ARCHITECTURE_STANDARDS.md` |
| DBアクセス・API実装・ログ出力 | セキュアコーディング | `.agents/docs/SECURITY_GUIDELINES.md` |
| TypeScriptの実装・修正 | TypeScriptコーディング規約 | `.agents/docs/TYPESCRIPT_GUIDELINES.md` |
| API設計・ドメインロジック実装 | ビジネスロジック・非機能要件 | `.agents/docs/BUSINESS_LOGIC_GUIDELINES.md` |
| 例外処理・エラーレスポンス実装 | エラーハンドリング統一規約 | `.agents/docs/ERROR_HANDLING_GUIDELINES.md` |
| テストの作成・修正 | テストコード作成規約 | `.agents/docs/TESTING_GUIDELINES.md` |
| コミット・ブランチ・PR作成 | Git / プルリクエスト運用 | `.agents/docs/GIT_WORKFLOW.md` |
| コードレビューの依頼時 | コードレビュー必須アクション | `.agents/docs/CODE_REVIEW_GUIDELINES.md` |
| README・API文書・ADR更新 | ドキュメンテーション規約 | `.agents/docs/DOCUMENTATION_GUIDELINES.md` |
| 「一気通貫フロー」の指示時 | Agentic Workflow | `.agents/docs/AGENTIC_WORKFLOW.md` |
