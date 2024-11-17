# @indiekit/store-gitea

[Gitea](https://gitea.com) (or Forgejo-based) content store adaptor for Indiekit.

## Installation

`npm install @indiekit/store-gitea`

## Requirements

A Gitea access token with read and write permissions to a repository.

> [!IMPORTANT]
> Store your access token in an environment variable called `GITEA_TOKEN` so that only you and the application can see it.

## Usage

Add `@indiekit/store-gitea` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-gitea"],
  "@indiekit/store-gitea": {
    "user": "username",
    "repo": "reponame"
  }
}
```

## Options

| Option     | Type     | Description                                                              |
| :--------- | :------- | :----------------------------------------------------------------------- |
| `instance` | `string` | Gitea instance URL. _Optional_, defaults to `https://gitea.com`.         |
| `user`     | `string` | Your Gitea username. _Required_.                                         |
| `repo`     | `string` | The name of your Gitea repository. _Required_.                           |
| `branch`   | `string` | The branch files will be saved to. _Optional_, defaults to `main`.       |
| `token`    | `string` | A Gitea access token. _Required_, defaults to `process.env.GITEA_TOKEN`. |
