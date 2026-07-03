# @indiekit/store-bitbucket

[Bitbucket](https://bitbucket.org) content store adaptor for Indiekit.

## Installation

`npm install @indiekit/store-bitbucket`

## Requirements

A [Bitbucket API token](https://id.atlassian.com/manage-profile/security/api-tokens) with `read:repository:bitbucket` and `write:repository:bitbucket` scopes.

> [!IMPORTANT]
> Store your app password in an environment variable called `BITBUCKET_TOKEN` so that only you and the application can see it.

## Usage

Add `@indiekit/store-bitbucket` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-bitbucket"],
  "@indiekit/store-bitbucket": {
    "email": "username@website.example",
    "user": "username",
    "repo": "reponame"
  }
}
```

## Options

| Option   | Type     | Description                                                                   |
| :------- | :------- | :---------------------------------------------------------------------------- |
| `email`  | `string` | Your Atlassian email. _Required_.                                             |
| `user`   | `string` | Your Bitbucket workspace. _Required_.                                         |
| `repo`   | `string` | The name of your Bitbucket repository. _Required_.                            |
| `branch` | `string` | The branch files will be saved to. _Optional_, defaults to `main`.            |
| `token`  | `string` | A Bitbucket API token. _Required_, defaults to `process.env.BITBUCKET_TOKEN`. |
