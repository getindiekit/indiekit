# @indiekit/store-github

Store IndieWeb content on GitHub.

## Installation

`npm i @indiekit/store-github`

## Usage

```js
const GithubStore = require('@indiekit/store-github');

const github = new GithubStore({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `user` | `string` | Your GitHub username. *Required*. |
| `repo` | `string` | The name of your GitHub repository. *Required*. |
| `branch` | `string` | The branch files will be saved to. *Optional*, defaults to `main`. |
| `token` | `string` | [A GitHub personal access token][pat]. *Required*, defaults to `process.env.GITHUB_TOKEN`. |

[pat]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
