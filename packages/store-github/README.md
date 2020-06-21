# @indiekit/store-github

Store IndieWeb content on GitHub.

## Installation

`npm i @indiekit/store-github`

## Configuration

```js
const GithubStore = require('@indiekit/store-github');

const github = new GithubStore({
  // config options here
});
```

### Options

* `token`: GitHub access token. **Required**.
* `user`: GitHub username. **Required**.
* `repo`: GitHub repository. **Required**.
* `branch`: GitHub branch files are saved to. *Optional*, defaults to `master`.
