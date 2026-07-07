# S4 ハンズオン: Skills

## 課題 #1: Antigravity Skills (15 分)

このディレクトリ直下で `agy` を起動すると、
`.agents/skills/pr-draft/SKILL.md` が読み込まれる。

```
/pr-draft
```

題材として `sample.diff` を読ませて、PR 本文の下書きを生成。

## 課題 #2: スキルへの引数・指示の受け渡し (10 分)

`.agents/skills/explain/SKILL.md` を作って、ファイルを解説するスキルを追加する。
ディレクトリ構造は `.agents/skills/explain/SKILL.md` とする。

```markdown
---
name: explain
description: 指定したファイルを解説
---
ユーザーに指定されたファイルを読んで、次の観点で解説して:
- 何をするコードか
- 注意すべきポイント
```

```
/explain sample.diff
```
または、「`sample.diff` を `/explain` で解説して」と自然文で渡す。

## 課題 #3: 自動起動の観察 (15 分)

`.claude/skills/pr-draft/SKILL.md` を用意済み。

このディレクトリで `claude` (または `agy` でも可) を起動 →

- 明示起動: `/pr-draft`
- 自動起動の観察: 「PR の下書きを作って」と自然文で依頼

→ Antigravity や Claude の Skill は自然言語のセマンティックマッチにより、自動でも発火することを確認する。

## 比較表（生成しながら埋める）

| 観点 | Antigravity Skills | Claude Skills |
|---|---|---|
| 形式 | Markdown + frontmatter | Markdown + frontmatter |
| 引数 | 自然文で渡せる | 自然文で渡せる |
| 自動起動 | ○ | ○ |
| ディレクトリに資料を同梱 | ○ | ○ |
