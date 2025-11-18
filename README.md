# Codex Auto Review

GitHub ActionsとCodexを使った自動コードレビューシステム

## 概要

このプロジェクトは、PRへの新しいコミット時に自動的にCodexにレビューを依頼し、Badge付きコメントに自動返信する仕組みを提供します。ルールや文言は `.codex/config.json` に集約し、GitHub Actions から参照します。

## 要件

### 必須要件

1. **Personal Access Token (Classic)**
   - GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 必要なスコープ: `repo` (フルアクセス)
   - リポジトリのSecrets(`PAT_TOKEN`)に登録が必要

2. **Codex連携**
   - リポジトリでCodexが利用可能であること
   - Codexがメンションに反応する設定になっていること

3. **GitHub Actions権限**
   - ワークフローで使用する権限:
     - `contents: read`
     - `pull-requests: write`
     - `issues: write`

4. **Codex設定ファイル**
   - `.codex/config.json` にレビュー依頼メッセージやバッジ判定キーワードを記述
   - 例:
     ```json
     {
       "review": {
         "request_comment": "@codex 日本語でレビューしてください"
       },
       "badges": {
         "keywords": ["P1 Badge", "P2 Badge", "P3 Badge"],
         "reply_message": "@codex 日本語でコメントを対応してください",
         "reaction": "eyes"
       }
     }
     ```

### 注意事項

- GitHub ActionsのデフォルトGITHUB_TOKENではCodexが反応しないため、PATが必須
- Fine-grained tokenではなく、Classic tokenを使用してください
- 運用ルールの詳細は `AGENTS.md` も参照してください

### フォークPRの制限

- **フォークPRでは自動レビュー依頼は動作しません**
  - セキュリティ上の理由により、フォークPRでは`secrets.PAT_TOKEN`にアクセスできません
  - フォークPRのコントリビューターは手動で`@codex`とメンションしてレビューを依頼してください
  - 内部ブランチからのPR（同一リポジトリ内）では自動化が正常に動作します

## ワークフロー

### 1. PR Review Request (`pr-review.yml`)

**トリガー**: `pull_request` (synchronize)
- PRに新しいコミットがプッシュされた時のみ動作
- force push、rebase、merge時にも発火

**動作**:
- `.codex/config.json` の `review.request_comment` を使って Codex へレビュー依頼コメントを投稿
- Personal Access Tokenを使用してCodexをトリガー

**なぜopenedイベントは含まない？**
- PR作成直後は手動でレビュー依頼することを想定
- 初回から自動化したい場合は`types: [opened, synchronize]`に変更可能

### 2. Comment Reply Automation (`comment-reply.yml`)

**トリガー**: `issue_comment`, `pull_request_review_comment` (created, edited)

**条件**: `.codex/config.json` の `badges.keywords` に含まれる文字列がコメント本文にある場合

**動作**:
1. 👀 リアクションを追加
   - PRレビューコメント: `createForPullRequestReviewComment`
   - 通常コメント: `createForIssueComment`
2. 返信コメントを投稿
   - PRレビューコメント: スレッド返信
   - 通常コメント: 新規コメント

## セットアップ

1. **Personal Access Tokenの作成**
   ```
   GitHub Settings
   → Developer settings
   → Personal access tokens
   → Tokens (classic)
   → Generate new token (classic)
   → repo にチェック
   ```

2. **Secretsに登録**
   ```
   リポジトリのSettings
   → Secrets and variables
   → Actions
   → New repository secret
   → Name: PAT_TOKEN
   → Secret: (作成したトークンを貼り付け)
   ```

3. **ワークフローファイルの配置**
   - `.github/workflows/pr-review.yml`
   - `.github/workflows/comment-reply.yml`

## 使い方

### 基本的な使用フロー

1. **PRを作成**
   - 初回は手動で`@codex`とメンションしてレビューを依頼
   - または、最初のコミットをプッシュするまで待つ

2. **コミットをプッシュ**
   - GitHub Actionsが「@codex 日本語でレビューしてください」とコメント
   - Codexがレビューを実施

3. **Badge付きコメントを投稿**
   - 「P1 Badge」などを含むコメントを投稿すると、`.codex/config.json` に沿って👀リアクションと返信コメントが追加される

### 手動でのレビュー依頼

いつでも`@codex`とメンションすることで、手動でレビューを依頼できます。
特にPR作成直後の初回レビューでは手動メンションが必要です。

## トラブルシューティング

### Codexが反応しない

- PATが正しく設定されているか確認
- PATのスコープに`repo`が含まれているか確認
- Classic tokenを使用しているか確認（Fine-grainedではなく）

### ワークフローが実行されない

- Actions タブでワークフローの実行状況を確認
- トリガー条件（synchronize、コメント内容）を確認

## ライセンス

MIT
