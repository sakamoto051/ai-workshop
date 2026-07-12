# answer-key

ハンズオン#1 で作成する `reviewer` Subagent の答え合わせ用ファイル。

（`orchestrator` / `frontend_researcher` / `backend_researcher` はハンズオン#2の時点で `.agents/agents/` に用意済みのため、ここには置いていない）

`.agents/agents/` には配置していない（自動的に読み込まれると、学習者が自分で定義を書く体験がなくなるため）。詰まったグループや時間短縮したい場合は、ディレクトリごと `.agents/agents/` にコピーして進める。

```bash
# コピー用コマンド例
cp -r answer-key/reviewer .agents/agents/

# シンプルなエージェントは配置するだけで自動認識されます（インストールや再起動は不要です）
```
