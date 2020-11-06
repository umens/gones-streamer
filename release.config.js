/* eslint-disable no-template-curly-in-string */
// var generate = require('project-name-generator');
// var release_name = generate({ words: 2, number: false, alliterative: true }).spaced;
// {{title}} - ${release_name}

module.exports = {
  branches: [
    "master",
    {
      name: "develop",
      channel: "beta",
      prerelease: "beta",
    }
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          {
            type: "docs",
            release: "patch",
          },
          {
            type: "style",
            release: "patch",
          },
          {
            type: "refactor",
            release: "patch",
          },
          {
            type: "perf",
            release: "patch",
          },
          {
            type: "test",
            release: "patch",
          },
          {
            type: "build",
            release: "patch",
          },
          {
            type: "ci",
            release: "patch",
          },
          {
            type: "chore",
            release: "patch",
          }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        writerOpts: {
          headerPartial: `
            {{#if isPatch~}}
              ##
            {{~else~}}
              #
            {{~/if}} :rocket: Release{{#if @root.linkCompare~}}
              [v{{version}}](
              {{~#if @root.repository~}}
                {{~#if @root.host}}
                  {{~@root.host}}/
                {{~/if}}
                {{~#if @root.owner}}
                  {{~@root.owner}}/
                {{~/if}}
                {{~@root.repository}}
              {{~else}}
                {{~@root.repoUrl}}
              {{~/if~}}
              /compare/{{previousTag}}...{{currentTag}})
            {{~else}} v{{~version}} 
            {{~/if}}
            {{~#if title}} "{{title}}"
            {{~/if}}
            {{~#if date}} ({{date}})
            {{/if}}
          `,
        },
        presetConfig: {
          types: [
            {
              type: "feat",
              section: ":sparkles: Enhancements",
              hidden: false,
            },
            {
              type: "fix",
              section: ":bug: Bug Fixes",
              hidden: false,
            },
            {
              type: "docs",
              section: ":memo: Documentation",
              hidden: false,
            },
            {
              type: "style",
              section: ":art: Styles",
              hidden: false,
            },
            {
              type: "refactor",
              section: ":zap: Code Refactoring",
              hidden: false,
            },
            {
              type: "perf",
              section: ":fast_forward: Performance Improvements",
              hidden: false,
            },
            {
              type: "test",
              section: ":heavy_check_mark: Tests",
              hidden: false,
            },
            {
              type: "ci",
              section: ":robot: Continuous Integration",
              hidden: false,
            },
            {
              type: "chore",
              section: ":recycle: Chores",
              hidden: false,
            }
          ]
        }
      }
    ],
    [
      "@semantic-release/changelog",
      {
        "changelogTitle": "Changelog",
      }
    ],
    [
      "@semantic-release/npm",
      {
        "npmPublish": false,
      }
    ],
    // [
    //   "@semantic-release/github",
    //   {
    //     "assets": [
    //       {
    //         "path": "CHANGELOG.md",
    //         "label": "Changelog",
    //       }
    //     ]
    //   }
    // ],
    // [
    //   "@semantic-release/git",
    //   {
    //     assets: [
    //       "package.json",
    //       "yarn.lock",
    //       "CHANGELOG.md"
    //     ],
    //     message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
    //   }
    // ]
  ],
  preset: "angular",
  dryRun: true,
  debug: true
}