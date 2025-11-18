# 変更履歴

## 2025-11-18

### フォークPR対策の実装
- **問題**: フォークPRでは`secrets.PAT_TOKEN`にアクセスできず、ワークフローが失敗
- **対応**: `pr-review.yml`にフォーク除外条件を追加
  - 条件: `github.event.pull_request.head.repo.full_name == github.repository`
  - 内部PRのみ自動レビュー依頼が実行される
- **影響**: フォークPRのコントリビューターは手動メンションが必要

### README整合性修正
- **問題**: READMEで「PRを作成すると、Codexが自動的にレビューを実施」と記載されていたが、実装では`opened`イベントを含まず動作しない
- **対応**: READMEの使用フローを実装に合わせて修正
  - PR作成時は手動メンションまたは最初のコミットプッシュまで待つことを明記
  - `opened`イベントを含まない理由を追記

### Personal Access Token (PAT) の追加
- **問題**: GitHub ActionsのデフォルトGITHUB_TOKENではCodexが反応しない
  - GitHub Actionsの仕様: GITHUB_TOKENで作成されたイベントは他のワークフローをトリガーしない（無限ループ防止）
- **対応**: 両ワークフローにPAT使用を追加
  - `pr-review.yml`: 25行目に`github-token: ${{ secrets.PAT_TOKEN }}`追加
  - `comment-reply.yml`: 25行目に`github-token: ${{ secrets.PAT_TOKEN }}`追加
- **要件**: Classic tokenの`repo`スコープが必要

### ワークフローのリファクタリング
- **変更**: 単一ファイルを責務ごとに分割
  - `pr-review.yml`: 新しいコミット時の自動レビュー依頼
  - `comment-reply.yml`: Badge付きコメントへの自動返信
- **削除**: 不要なコメントアウトコードと"hello world"ステップを削除
- **改善**: わかりやすいジョブ名とステップ名に変更

### 包括的なドキュメント追加
- 必須要件とセットアップ手順を詳細化
- トラブルシューティングガイドを追加
- フォークPRの制限事項セクションを追加
