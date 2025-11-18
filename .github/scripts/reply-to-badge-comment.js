/**
 * Badge付きコメントに自動返信するスクリプト
 *
 * @param {object} github - GitHub API client
 * @param {object} context - GitHub Actions context
*/
const fs = require('fs');
const path = require('path');

module.exports = async ({ github, context }) => {
  const isPullRequestReviewComment = context.payload.comment.pull_request_review_id;
  const commentId = context.payload.comment.id;
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  // 設定ファイルからキーワードと返信内容を取得
  const configPath = path.join(process.cwd(), '.codex', 'config.json');
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : {};
  const keywords = config?.badges?.keywords || [];
  const replyMessage = config?.badges?.reply_message || '@codex コメントを対応してください';
  const reaction = config?.badges?.reaction || 'eyes';

  // 条件に合わなければ何もしない
  const body = context.payload.comment.body || '';
  const matched = keywords.some((keyword) => body.includes(keyword));
  if (!matched) return;

  // リアクションを追加
  if (isPullRequestReviewComment) {
    await github.rest.reactions.createForPullRequestReviewComment({
      owner,
      repo,
      comment_id: commentId,
      content: reaction
    });
  } else {
    await github.rest.reactions.createForIssueComment({
      owner,
      repo,
      comment_id: commentId,
      content: reaction
    });
  }

  // コメントを投稿
  if (isPullRequestReviewComment) {
    await github.rest.pulls.createReplyForReviewComment({
      owner,
      repo,
      pull_number: context.issue.number,
      comment_id: commentId,
      body: replyMessage
    });
  } else {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: context.issue.number,
      body: replyMessage
    });
  }
};
