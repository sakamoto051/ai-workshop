# answer-key

ハンズオン#1・#2 で作成する Subagent 定義の答え合わせ用ファイル。

`.agents/plugins/hands-on-plugin/agents/` には配置していない（自動的に読み込まれると、学習者が自分で定義を書く体験がなくなるため）。詰まったグループや時間短縮したい場合は、該当ファイルを `.agents/plugins/hands-on-plugin/agents/` にコピーして進める。

```bash
# コピー用コマンド例
cp answer-key/reviewer.md .agents/plugins/hands-on-plugin/agents/
cp answer-key/frontend-researcher.md .agents/plugins/hands-on-plugin/agents/
cp answer-key/backend-researcher.md .agents/plugins/hands-on-plugin/agents/

# 反映のためのインストール実行
agy plugin install .agents/plugins/hands-on-plugin
```
