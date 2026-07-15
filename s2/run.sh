#!/bin/bash

# このプロンプトを実行する際のコンテキスト制御の意図：
# 
# ■ 読ませたいファイル（タスク解決に必要な規約）：
#   - ARCHITECTURE_STANDARDS.md (4層アーキテクチャの定義)
#   - TYPESCRIPT_GUIDELINES.md (TypeScript のコーディング規約)
#   - ERROR_HANDLING_GUIDELINES.md (エラーハンドリング規約)
#   ※概要版 AGENTS.md を適用した際、AIがこれらを自律的に読み込むことを期待する。
# 
# ■ 読ませたくない（スキップさせたい）ファイル：
#   - GIT_WORKFLOW.md, TESTING_GUIDELINES.md, DOCUMENTATION_GUIDELINES.md など
#   ※今回の設計タスクには無関係な規約のロードをスキップさせ、初期入力トークンを節約する。
# 
# ■ スキップさせたい処理：
#   - 実際のファイル書き込み処理（write_to_file 等の実行を抑え、応答を高速化する）

PROMPT="TypeScriptで、ユーザーが商品に対して新規にレビューを投稿するAPIを追加したい。コーディング規約に準拠した具体的な設計方針と、ユースケース層のコード骨組みを提示してください。ファイルの作成は行わず、テキストでの説明のみとしてください。"

agy -i "$PROMPT"
