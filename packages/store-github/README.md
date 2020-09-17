# @indiekit/store-github

Store IndieWeb content on GitHub.

## Installation

`npm i @indiekit/store-github`

## Usage

```js
const GithubStore = require('@indiekit/store-github');

const github = new GithubStore({
  // config options here
});
```

## Options

### `branch`

The branch files will be saved to.

Type: `string`\
*Optional*, defaults to `master`

### `repo`

The name of your GitHub repository.

Type: `string`\
*Required*

### `token`

A GitHub access token.

Type: `string`\
*Required*

### `user`

Your GitHub username.

Type: `string`\
*Required*
