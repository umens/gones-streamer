module.exports = {
  "milestone-match": "Release v{{tag_name}}",
  "data-source": "milestones",
  prefix: "v",
  ignoreIssuesWith: [
    "duplicate",
    "question",
    "wontfix",
    "invalid",
    "help wanted",
    "good first issue",
  ],
  template: {
    issue: "- [{{text}}]({{url}}) {{name}}",
    group: "\n#### {{heading}}\n",
    release: "## :rocket: Release {{release}} ({{date}})\n{{body}}",
  },
  groupBy: {
    ":zap: Enhancements:": ["enhancement"],
    ":hammer: Bug Fixes:": ["bug"],
    ":recycle: Dependencies Updates && Other chores:": ["chores", "dependencies"],
  },
}

