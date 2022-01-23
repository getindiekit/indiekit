# @indiekit/store-bitbucket

Store IndieWeb content on Bitbucket.

## Installation

`npm i @indiekit/store-bitbucket`

## Usage

Add `@indiekit/store-bitbucket` to your list of plugins, specifying options as required:

```json
{
  "plugins": [
    "@indiekit/store-bitbucket"
  ],
  "@indiekit/store-bitbucket": {
    "user": "username",
    "repo": "reponame"
  }
}
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `user` | `string` | Your Bitbucket username. *Required*. |
| `repo` | `string` | The name of your Bitbucket repository. *Required*. |
| `branch` | `string` | The branch files will be saved to. *Optional*, defaults to `main`. |
| `password` | `string` | A Bitbucket [app password](https://bitbucket.org/account/settings/app-passwords/). *Required*, defaults to `process.env.BITBUCKET_PASSWORD`. |
