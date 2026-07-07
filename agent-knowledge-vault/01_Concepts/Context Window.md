---
title: Context Window Comparison
date: 2026-06-23
tags: [concept, tool, comparison]
related: [[01_Concepts/AI Agents]], [[02_Tools/Claude Code]], [[02_Tools/Antigravity CLI]], [[02_Tools/Codex CLI]]
status: processed
---

# AI エージェントのコンテキストウィンドウ比較仕様

AIエージェント（Antigravity, Claude Code, Codex等）を利用・運用する上で、コンテキストウィンドウの制限とその仕様（特にクレジットの有無による変動）を把握することは、開発コスト管理や手戻りの防止において極めて重要です。

---

## 3大エージェントの仕様対比

| エージェント (ベースモデル) | 基本制限 (未課金/通常) | 最大制限 (クレジット有効時) | 特徴・自動管理のアプローチ |
| :--- | :---: | :---: | :--- |
| **Antigravity CLI**<br>(Gemini 1.5 Pro / 2.0 Pro) | **1M 〜 2M** | **2M** | 圧倒的な大容量。プロジェクト全体を一度に読み込むことが可能。ただし、不要なファイルが含まれるとトークン費用が嵩むため、除外設定が必要。 |
| **Codex CLI**<br>(GPT-4o / GPT-5系) | **128K** | **128K** | コンテキストウィンドウが非常に狭い。不要ファイルを厳密に除外（`.gitignore` / `.promptignore`）し、ファイルをピンポイントで渡す精密な管理が必須。 |
| **Claude Code**<br>(Sonnet 4.6 / Opus 4.6〜4.8) | **200K 〜 500K**<br>(※1) | **1M**<br>(※2) | 有料プランの枠内では200K〜500K。制限に近づくと、履歴の古いメッセージを自動要約して容量を空ける「自動コンテキスト管理」を搭載。 |

### ※1: Claude Code の通常時（クレジット未有効）の仕様
使用クレジット（usage credits）を追加購入・有効化していない場合、有料プラン（Pro / Team 等）であってもWebチャット版と同等の制限が適用されます。
- **最新モデル (Sonnet 4.6, Opus 4.6〜4.8)**: **50万 (500K) トークン**
- **それ以外のモデル (旧モデル等)**: **20万 (200K) トークン**

### ※2: Claude Code の拡張（クレジット有効）の仕様
Pro / Team などのプランで「使用クレジット（usage credits）」を追加購入・有効化することで、コンテキストウィンドウが最大 **100万 (1M) トークン** まで拡張されます。

---

## 実務におけるコンテキスト管理の設計方針

### 1. 2つの無視設定（除外ルール）を徹底する
コンテキストがどれほど広くても、エージェントが「ノイズ」を読み込むと動作が遅くなり、無駄なAPI費用が発生します。
- **ファイル除外**: `.gitignore` に一時ファイル、ログ（`*.log`）、巨大なデータ、ビルド成果物を追加する。
- **ツール専用除外**: 必要に応じて `.promptignore` や `AGENTS.md` の触らないディレクトリ指定を活用する。

### 2. 暗黙のルールは `AGENTS.md` に永続化する
コンテキストウィンドウを無駄な「手戻りデバッグ（ターン数）」で消費しないために、開発コマンドや規約は `AGENTS.md` に明記しておく。

---

## 関連ノート
- [[01_Concepts/AI Agents|AI Agents (エージェントとは)]]
- [[02_Tools/Claude Code|Claude Code の詳細仕様]]
- [[02_Tools/Antigravity CLI|Antigravity CLI (agy)]]
- [[02_Tools/Codex CLI|Codex CLI]]
- [[03_Guides/Prompt Engineering|Prompt Engineering & AGENTS.md]]
