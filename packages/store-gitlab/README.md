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

### Options

* `host`: GitLab Instance Host URL. *Optional*, defaults to `https://gitlab.com`.
* `token`: GitLab access token. **Required**.
* `user`: GitLab username. **Required (if `projectId` not provided)**.
* `repo`: GitLab repository. **Required (if `projectId` not provided)**.
* `projectId`: GitLab project ID. **Required (if `user` and `repo` not provided)**.
* `branch`: GitLab branch files are saved to. *Optional*, defaults to `master`.
