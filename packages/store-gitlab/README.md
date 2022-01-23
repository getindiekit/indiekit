# @indiekit/store-gitlab

Store IndieWeb content on GitLab.

## Installation

`npm i @indiekit/store-gitlab`

## Usage

Add `@indiekit/store-gitlab` to your list of plugins, specifying options as required:

```json
{
  "plugins": [
    "@indiekit/store-gitlab"
  ],
  "@indiekit/store-gitlab": {
    "user": "username",
    "repo": "reponame"
  }
}
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `instance` | `string` | GitLab instance URL. *Optional*, defaults to `https://gitlab.com`. |
| `projectId` | `string` | GitLab project ID. *Required (if `user` and `repo` not provided)*. |
| `user` | `string` | Your GitLab username. *Required (if `projectId` not provided)*. |
| `repo` | `string` | The name of your GitLab repository. *Required (if `projectId` not provided)*. |
| `branch` | `string` | The branch files will be saved to. *Optional*, defaults to `main`. |
| `token` | `string` | A GitLab access token. *Required*, defaults to `process.env.GITLAB_TOKEN`. |
