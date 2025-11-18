# Review Commit Iteration

このリポジトリは、GitHub ActionsとCodexを使った自動レビューシステムのテストプロジェクトです。

## ワークフロー

### PR Review Request (pr-review.yml)
- PRに新しいコミットがプッシュされた時に自動的にCodexにレビューを依頼
- Personal Access Tokenを使用してCodexをトリガー

### Comment Reply Automation (comment-reply.yml)
- P1/P2/P3 Badge付きコメントに自動返信
- PRレビューコメントと通常のissueコメントの両方に対応
- 👀 リアクションを自動追加

## 使い方

1. PRを作成すると、Codexが自動的にレビューを実施
2. 新しいコミットをプッシュすると、GitHub ActionsがCodexにレビューを依頼
3. Badge付きコメントには自動的に返信とリアクションが付きます
