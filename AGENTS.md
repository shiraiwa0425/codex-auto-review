# Codex Ops Guide

## プロジェクトコンテキスト

このサブモジュールの親プロジェクトの詳細は、親リポジトリの **[PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md)** を参照してください。

## codex-auto-review 固有の設定

このリポジトリで Codex を自動レビュー運用するための要点をまとめています。設定は `.codex/config.json` に集約し、GitHub Actions から参照します。

## 役割とフロー

- PR 更新 (`pull_request` synchronize) で Codex へレビュー依頼コメントを投稿。
- バッジ付きコメント (`P1 Badge`, `P2 Badge`, `P3 Badge`) に対し、👀 リアクションと返信を自動投稿。
- フォーク PR では Secrets が使えないため、自動化は内部ブランチのみを対象。

## 設定ファイル (`.codex/config.json`)

- `review.request_comment`: Codex を呼ぶときのメンション文言。
- `badges.keywords`: バッジ判定に使う文字列。
- `badges.reply_message`: バッジ検出時に返すコメント。
- `badges.reaction`: 付与するリアクション絵文字 (コロンなしの短縮名)。

## ワークフローの権限

- `contents: read`
- `pull-requests: write`
- `issues: write`

## トークン

- `secrets.PAT_TOKEN` (Classic, scope `repo`) を使用。`GITHUB_TOKEN` では Codex が反応しない前提。

## レビューの観点メモ

- 動作への影響が大きいものを P1、改善・テスト不足などは P2、軽微・スタイルは P3 を目安にバッジを付与。
- 不要ファイルや生成物 (`dist/` など) はレビュー対象から外す運用を推奨。
- コメントは日本語で簡潔に。根拠となるファイル/行を可能な範囲で明記する。
- このPRの変更パターンが他のファイルにも適用できないか確認してください。
