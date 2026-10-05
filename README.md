# AI エージェント入門ワークショップ
AI コーディングエージェントの使い方を、スライドと比較デモで学ぶ4回構成の教材。コンテキスト管理、Skills、MCP、Subagents を扱う。

## 内容
1. [第1回: 全体像とコンテキスト管理](1/slides.md): 関係する規約を必要なときに読み込む構成
2. [第2回: Skills](2/slides.md): ルールだけの場合とスキルを利用する場合の比較
3. [第3回: MCP](3/slides.md): ブラウザ操作、天気サーバー、応答サイズの比較
4. [第4回: Subagents](4/slides.md): 調査・レビューの役割分担

## 技術と構成
- Marp / Markdown / CSS: スライドと共通テーマ
- Node.js / JavaScript、Python、Shell: 実演用アプリと検証スクリプト
- Playwright: スライドの DOM はみ出し検知
- `1/` 〜 `4/`: 各回の slides.md、生成済みHTML/PPTX、デモ
- [theme/workshop.css](theme/workshop.css): 共通デザイン
- [.agents/scripts](.agents/scripts): レイアウト・流れ・表示確認
- [PREREQUISITES.md](PREREQUISITES.md): 実演環境の事前準備

## 教材設計のポイント
単に手順を紹介するだけでなく、関連・非関連コンテキスト、スキル有無、応答の絞り込み、役割分担を比較できる構成。スライドの体裁を静的解析とブラウザ検証で確認する仕組みも含む。

## 閲覧と生成
生成済みの各 `slides.html` をブラウザで開く。再生成には Node.js・npm・Python 3 を用意する。
```sh
npm ci
npm run slides:html
npm run slides:watch
```
実演用 CLI・MCP サーバーの依存条件は各回のスライドと事前準備ガイドに従う。CLI のアカウントや認証は各自の環境で設定する。

## 検証
```sh
npm run lint:layout
npm run lint:flow
npm run test:slides
```
表示検証には Playwright の対応ブラウザが必要。各デモの実行は別工程であり、スライドの検証だけで外部サービスとの連携を保証しない。

## 設定と安全性
- 第1回の環境変数サンプルは [1/demo/.env.example](1/demo/.env.example) に移している。必要な場合だけ同じ場所の `.env` にコピーする。
- サンプルはすべて教材用のダミー値であり、実際のAPIキーやDB接続情報に置き換えたファイルをコミットしない。
- `3/demo/sample.db` は空の教材ファイル。実データや個人情報を入れたDBは追跡しない。
- 生成HTML・PPTX・画像を配布するときも、画面内のアカウント情報や実値の混入を別途確認する。

## 現状の制約
外部 CLI やサービスの仕様は変化するため、開催前の実演確認が必要。リポジトリは教材とデモの実装を示すもので、研修の実施人数、業務導入成果、効果測定などは記載していない。
