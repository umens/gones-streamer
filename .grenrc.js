module.exports = {
  "milestone-match": "Release v{{tag_name}}",
  prefix: "v",
  ignoreIssuesWith: [
    "duplicate",
    "wontfix",
    "invalid",
    "help wanted"
  ],
  template: {
    issue: "- [{{text}}]({{url}}) {{name}}",
    group: "\n#### {{heading}}\n",
    release: "## :rocket: {{release}} ({{date}})\n{{body}}",
  },
  groupBy: {
    ":hammer: Enhancements:": ["enhancement"],
    ":bug: Bug Fixes:": ["bug"]
  },
}

