# @indiekit/store-gitea

Store IndieWeb content on Gitea.

## Installation

`npm i @indiekit/store-gitea`

## Usage

Add `@indiekit/store-gitea` to your list of plugins, specifying options as required:

```json
{
  "plugins": [
    "@indiekit/store-gitea"
  ],
  "@indiekit/store-gitea": {
    "user": "username",
    "repo": "reponame"
  }
}
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `instance` | `string` | Gitea instance URL. *Optional*, defaults to `https://gitea.com`. |
| `user` | `string` | Your Gitea username. *Required*. |
| `repo` | `string` | The name of your Gitea repository. *Required*. |
| `branch` | `string` | The branch files will be saved to. *Optional*, defaults to `main`. |
| `token` | `string` | A Gitea access token. *Required*, defaults to `process.env.GITEA_TOKEN`. |
