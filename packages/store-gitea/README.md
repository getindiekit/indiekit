# @indiekit/store-gitea

Store IndieWeb content on Gitea.

## Installation

`npm i @indiekit/store-gitea`

## Configuration

```js
const GiteaStore = require('@indiekit/store-gitea');

const gitea = new GiteaStore({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `branch` | `string` | The branch files will be saved to. *Optional*, defaults to `main` |
| `instance` | `string` | Gitea instance URL. *Optional*, defaults to `https://gitea.com` |
| `user` | `string` | Your Gitea username. *Required* |
| `repo` | `string` | The name of your Gitea repository. *Required* |
| `token` | `string` | A Gitea access token. *Required* |
