# Session 4 デモンストレーション

このディレクトリは、第4回「MCP 編」のスライドに合わせて、既製の MCP サーバーの利用・自作サーバーの実装・戻り値サイズがコンテキストに与える影響を実演するためのものです。

## 原則: 1デモ = 1ディレクトリ = 1つの `.agents/`

`agy` は**起動したディレクトリを workspace root として扱う**（CLI ログの `workspaceDirs` で確認できる）。
MCP サーバーは workspace root の `.agents/mcp_config.json` から読み込まれるため、
デモを**兄弟ディレクトリ**に分けておけば互いの MCP 設定が混ざることはない。
そのため設定の使い分けは「どのディレクトリで `agy` を起動するか」で行う。**`mcp_config.json` の中身を差し替える必要はない。**

なお、リポジトリルートの `.agents/skills/` などは起動ディレクトリに関係なく読み込まれることがある
（Context Usage の `Skills` に計上される）。分離が保証されるのは MCP 設定について。

## ディレクトリ構成

- `demo1-playwright-app/`：既製の Playwright MCP を使うデモ（`.agents/mcp_config.json` に `playwright` を登録済み）
- `demo2-weather-server/`：天気 MCP サーバーを自作するハンズオン（`.agents/mcp_config.json` に `weather` を登録）
- `demo3-response-size/`：レスポンスの絞り込みあり／なしの比較実験（任意）。`.agents/mcp_config.json` に `weather-response-size` を登録

`demo3-response-size/` はスクリプトと設定だけを持ち、サーバー本体は
`demo2-weather-server/weather-mcp-server/response-size-server.js` を参照する（`node_modules` を共有するため）。

このサーバーの2つのツールは **まったく同じAPIリクエスト** を発行し、違うのは「取得した
データをどう返すか」だけ。`get_weather_raw` は JSON をそのまま全部返し、
`get_weather_filtered` は同じ JSON から現在の気温・風速だけを抽出して返す。
比較したい変数を「整形の有無」1つに絞るための設計で、そのぶん絞り込み側も
実務なら不要な重いリクエストを行っている点は割り切っている。

## スクリプト一覧

| スクリプト | 実行する場所 | いつ実行するか | 見るもの |
|---|---|---|---|
| `run.sh` | `demo1-playwright-app/` | 別ターミナルで demo アプリを起動した後 | エージェントが自分でブラウザを操作し撮影まで完了すること |
| `run_step1.sh` | `demo2-weather-server/` | ステップ1（`npm install` と `mcp_config.json` の絶対パス書き換え）の後 | `get_weather` が呼ばれ、東京の気温と風速が返ること |
| `run_step3.sh` | `demo2-weather-server/` | ステップ3（`index.js` に明日の予報を追加）の後 | 明日の最高／最低気温が、Web検索ではなくツール経由で返ること |
| `run_filtered.sh` | `demo3-response-size/` | 比較実験。先に実行する | 応答直後の Context Usage（絞り込み側の基準値） |
| `run_raw.sh` | `demo3-response-size/` | 比較実験。**新規会話**で実行して比較する | 同じ Context Usage が全部盛りでどれだけ増えるか |

比較実験の2スクリプトは、**ツール名以外まったく同じ最小のプロンプト**を使う。
「検索はせずに」のような否定の指示は足していない。解釈の余地が増えてかえって
実行ごとのブレが大きくなるうえ、実際に観測されるノイズ（エージェントが
`SKILL.md` などを読みに行く動作）は検索ではないので効かないため。

**`Read` は抑制しない。** `get_weather_raw` の実行でエージェントが
`~/.gemini/antigravity-cli/brain/<id>/.system_generated/steps/N/output.txt` を
`Read` するのは正常な動作で、CLI が巨大なツール出力を一旦ファイルへ退避し、
モデルがそれを読み戻しているため（146,319 バイトのファイルが生成されていることを確認済み）。
`Tool calls` の増分が戻り値サイズに比例しないのはこれが理由。

なお `System tools`（ツール定義の分）はツールを呼んだかどうかに左右されない。
登録されている定義の集合が同じであれば同じ値になるので、比較の基準線として使える。

## 準備

**MCP サーバーを手動で起動する手順はない。** stdio 型の MCP サーバーは、`agy` が
`mcp_config.json` の `command` / `args` に従って子プロセスとして自動起動する。
必要なのは次の2点だけ。

1. 依存パッケージのインストール（`index.js` と `response-size-server.js` の両方がこれを使う）

    ```bash
    cd demo2-weather-server/weather-mcp-server
    npm install
    ```

2. `demo2-weather-server/` と `demo3-response-size/` の `.agents/mcp_config.json` に書かれている
   絶対パスを、**自分の環境のパスに書き換える**

どちらかが欠けていると、`agy` はサーバーを起動できず「ツールが使えません」とだけ答える。
`demo3-response-size/` の実行スクリプトは、起動前にこの2点を検査して止まるようにしてある。

## 実演手順

### デモ1: 既製 MCP を使う

```bash
cd demo1-playwright-app
./run.sh
```

### デモ2: MCP サーバーを自作する（ハンズオン本体）

```bash
cd demo2-weather-server
./run_step1.sh     # ステップ1: 接続確認
# index.js を編集して明日の予報に対応させる
./run_step3.sh     # ステップ3: 機能拡張の確認
```

期待通り動かない場合は、エージェントを介さず直接サーバーの応答を確認できる。

```bash
npx @modelcontextprotocol/inspector node weather-mcp-server/index.js
```

### デモ3: レスポンスの絞り込みあり／なしを比べる（任意）

```bash
cd demo3-response-size
./run_filtered.sh  # 絞り込み → Context Usage を控える
./run_raw.sh       # 【新規会話で】全部盛り → 同じ箇所を比較
```

戻り値そのものの文字数を見たい場合:

```bash
npx @modelcontextprotocol/inspector node ../demo2-weather-server/weather-mcp-server/response-size-server.js
```
