const fs = require('fs');
const path = require('path');

module.exports = async ({ github, context }) => {
  const configPath = path.join(process.cwd(), '.codex', 'config.json');
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : {};
  const body = config?.review?.request_comment || '@codex レビューしてください';

  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body
  });
};
