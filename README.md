# AI エージェント入門ワークショップ
AIコーディングエージェントを学ぶ4回構成のスライド・比較デモ教材。コンテキスト管理、Skills、MCP、Subagentsを扱う。

## 内容
1. [全体像とコンテキスト管理](1/slides.md): 関係する規約を必要なときに読み込む構成
2. [Skills](2/slides.md): ルールのみの場合とスキル利用時の比較
3. [MCP](3/slides.md): ブラウザ操作・天気サーバー・応答サイズの比較
4. [Subagents](4/slides.md): 調査・レビューの役割分担

## 技術構成
- Marp / Markdown / CSS: スライドと共通テーマ
- Node.js / JavaScript、Python、Shell: デモと検証スクリプト
- Playwright: スライドのDOMはみ出し検知

## ディレクトリ
- `1/`〜`4/`: 各回のslides.md、生成済みHTML・PPTX、デモ
- [theme/workshop.css](theme/workshop.css): 共通デザイン
- [.agents/scripts](.agents/scripts): レイアウト・流れ・表示確認
- [PREREQUISITES.md](PREREQUISITES.md): デモ環境の事前準備

## 閲覧・生成
生成済みの各slides.htmlをブラウザで開く。再生成にはNode.js・npm・Python 3が必要。
```sh
npm ci
npm run slides:html
npm run slides:watch
```

PDFを生成する場合:
```sh
npm run slides:pdf
```
各デモのCLI・MCPサーバーの依存条件は、各回のスライドと事前準備ガイドを参照する。

## 検証
```sh
npm run lint:layout
npm run lint:flow
npm run test:slides
```
表示検証にはPlaywrightの対応ブラウザが必要。

## デモの設定
第1回で環境ファイルが必要な場合は、[1/demo/.env.example](1/demo/.env.example) を同じ場所の .env へコピーする。サンプルは教材用ダミー値。実際の資格情報を設定した .env はコミットしない。

`3/demo/sample.db` は空の教材ファイル。各CLIの認証とアカウント設定は利用する開発環境で行う。
