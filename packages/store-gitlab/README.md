# @indiekit/store-gitlab

[GitLab](https://gitlab.com) content store adaptor for Indiekit.

## Installation

`npm install @indiekit/store-gitlab`

## Usage

Add `@indiekit/store-gitlab` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-gitlab"],
  "@indiekit/store-gitlab": {
    "user": "username",
    "repo": "reponame"
  }
}
```

## Options

| Option      | Type     | Description                                                                   |
| :---------- | :------- | :---------------------------------------------------------------------------- |
| `instance`  | `string` | GitLab instance URL. _Optional_, defaults to `https://gitlab.com`.            |
| `projectId` | `string` | GitLab project ID. _Required (if `user` and `repo` not provided)_.            |
| `user`      | `string` | Your GitLab username. _Required (if `projectId` not provided)_.               |
| `repo`      | `string` | The name of your GitLab repository. _Required (if `projectId` not provided)_. |
| `branch`    | `string` | The branch files will be saved to. _Optional_, defaults to `main`.            |
| `token`     | `string` | A GitLab access token. _Required_, defaults to `process.env.GITLAB_TOKEN`.    |
