# @indiekit/store-bitbucket

[Bitbucket](https://bitbucket.org) content store adaptor for Indiekit.

## Installation

`npm install @indiekit/store-bitbucket`

## Requirements

A [Bitbucket app password](https://bitbucket.org/account/settings/app-passwords/).

> [!IMPORTANT]
> Store your app password in an environment variable called `BITBUCKET_PASSWORD` so that only you and the application can see it.

## Usage

Add `@indiekit/store-bitbucket` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-bitbucket"],
  "@indiekit/store-bitbucket": {
    "user": "username",
    "repo": "reponame"
  }
}
```

## Options

| Option     | Type     | Description                                                                         |
| :--------- | :------- | :---------------------------------------------------------------------------------- |
| `user`     | `string` | Your Bitbucket username. _Required_.                                                |
| `repo`     | `string` | The name of your Bitbucket repository. _Required_.                                  |
| `branch`   | `string` | The branch files will be saved to. _Optional_, defaults to `main`.                  |
| `password` | `string` | A Bitbucket app password. _Required_, defaults to `process.env.BITBUCKET_PASSWORD`. |
