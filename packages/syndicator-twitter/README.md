# @indiekit/syndicator-twitter

Syndicate IndieWeb content to Twitter.

## Installation

`npm i @indiekit/syndicator-twitter`

## Requirements

A set of Twitter API keys. You can get these from <https://developer.twitter.com>.

## Usage

```js
const TwitterSyndicator = require('@indiekit/syndicator-twitter');

const twitter = new TwitterSyndicator({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `accessToken` | `string` | Your Twitter access token. *Required*, defaults to `process.env.TWITTER_ACCESS_TOKEN`. |
| `accessTokenSecret` | `string` | Your Twitter access token secret. *Required*, defaults to `process.env.TWITTER_ACCESS_TOKEN_SECRET`. |
| `apiKey` | `string` | Your Twitter API key. *Required*, defaults to `process.env.TWITTER_API_KEY`. |
| `apiKeySecret` | `string` | Your Twitter API secret key. *Required*, defaults to `process.env.TWITTER_API_KEY_SECRET`. |
| `user` | `string` | Your Twitter username (without the `@`). *Required*. |
| `checked` | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. *Optional*, defaults to `false`. |
| `forced` | `boolean` | Ignore the presence or value of `checked` and always syndicate. *Optional*. |
