# @indiekit/store-gitea

[Gitea](https://gitea.com) content store adaptor for Indiekit.

## Installation

`npm i @indiekit/store-gitea`

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
