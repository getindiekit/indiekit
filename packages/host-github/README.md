# @indiekit/host-github

*Publish to the IndieWeb via GitHub*

## Installation

`npm i @indiekit/host-github`

## Configuration

```js
const Host = require('@indiekit/host-github');

const github = new Host({
  // config options here
});
```

### Options

* `token`: GitHub access token. **Required**.
* `user`: GitHub username. **Required**.
* `repo`: GitHub repository. **Required**.
* `branch`: GitHub branch files are saved to. *Optional*, defaults to `master`.
