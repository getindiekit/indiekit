# @indiekit/store-gitea

Store IndieWeb content on Gitea.

## Installation

`npm i @indiekit/store-gitea`

## Configuration

```js
const GiteaStore = require('@indiekit/store-gitea');

const gitea = new GiteaStore({
  // config options here
});
```

## Options

### `branch`

The branch files will be saved to.

Type: `string`\
*Optional*, defaults to `master`

### `host`

Gitea instance URL.

Type: `string`\
*Optional*, defaults to `https://gitea.com`

### `repo`

The name of your Gitea repository.

Type: `string`\
*Required*

### `token`

A Gitea access token.

Type: `string`\
*Required*

### `user`

Your Gitea username.

Type: `string`\
*Required*
