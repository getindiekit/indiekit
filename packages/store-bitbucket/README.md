# @indiekit/store-bitbucket

Store IndieWeb content on Bitbucket.

## Installation

`npm i @indiekit/store-bitbucket`

## Usage

```js
const BitbucketStore = require('@indiekit/store-bitbucket');

const bitbucket = new BitbucketStore({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `branch` | `string` | The branch files will be saved to. *Optional*, defaults to `master` |
| `user` | `string` | Your Bitbucket username. *Required* |
| `repo` | `string` | The name of your Bitbucket repository. *Required* |
| `password` | `string` | A Bitbucket [app password](https://bitbucket.org/account/settings/app-passwords/). |
