/**
 * Badge付きコメントに自動返信するスクリプト
 *
 * @param {object} github - GitHub API client
 * @param {object} context - GitHub Actions context
 */
module.exports = async ({ github, context }) => {
  const isPullRequestReviewComment = context.payload.comment.pull_request_review_id;
  const commentId = context.payload.comment.id;
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  // リアクションを追加
  if (isPullRequestReviewComment) {
    await github.rest.reactions.createForPullRequestReviewComment({
      owner,
      repo,
      comment_id: commentId,
      content: 'eyes'
    });
  } else {
    await github.rest.reactions.createForIssueComment({
      owner,
      repo,
      comment_id: commentId,
      content: 'eyes'
    });
  }

  // コメントを投稿
  const replyMessage = '@codex 日本語でコメントを対応してください';

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
