# @indiekit/store-gitlab

Store IndieWeb content on GitLab.

## Installation

`npm i @indiekit/store-gitlab`

## Configuration

```js
const GitlabStore = require('@indiekit/store-gitlab');

const gitlab = new GitlabStore({
  // config options here
});
```

## Options

### `branch`

The branch files will be saved to.

Type: `string`\
*Optional*, defaults to `master`

### `host`

GitLab instance URL.

Type: `string`\
*Optional*, defaults to `https://gitlab.com`

### `projectId`

GitLab project ID.

Type: `string`\
*Required (if `user` and `repo` not provided)*

### `repo`

The name of your GitLab repository.

Type: `string`\
*Required (if `projectId` not provided)*

### `token`

A GitLab access token.

Type: `string`\
*Required*

### `user`

Your GitLab username.

Type: `string`\
*Required (if `projectId` not provided)*
