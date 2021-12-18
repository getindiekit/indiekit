# @indiekit/syndicator-twitter

Syndicate IndieWeb content to Twitter.

## Installation

`npm i @indiekit/syndicator-twitter`

## Usage

```js
const TwitterSyndicator = require('@indiekit/syndicator-twitter');

const twitter = new TwitterSyndicator({
  // Options
});
```

## Options

You can get your Twitter API keys from <https://developer.twitter.com>.

| Option | Type | Description |
| :----- | :--- | :---------- |
| `apiKey` | `string` | Your Twitter API key. *Required* |
| `apiKeySecret` | `string` | Your Twitter API secret key. *Required* |
| `accessToken` | `string` | Your Twitter access token. *Required* |
| `accessTokenSecret` | `string` | Your Twitter access token secret. *Required* |
| `user` | `string` | Your Twitter username (without the `@`). *Required* |
| `checked` | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. *Optional*, defaults to `false` |
