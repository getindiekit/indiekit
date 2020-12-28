# @indiekit/syndicator-twitter

Syndicate IndieWeb content to Twitter.

## Installation

`npm i @indiekit/syndicator-twitter`

## Usage

```js
const TwitterSyndicator = require('@indiekit/syndicator-twitter');

const twitter = new TwitterSyndicator({
  // config options here
});
```

## Options

You can get your Twitter API keys from <https://developer.twitter.com/>.

### `apiKey`

Your Twitter API key.

Type: `string`\
*Required*

### `apiKeySecret`

Your Twitter API secret key.

Type: `string`\
*Required*

### `accessToken`

Your Twitter access token.

Type: `string`\
*Required*

### `accessTokenSecret`

Your Twitter access token secret.

Type: `string`\
*Required*

### `user`

Your Twitter username (without the `@`).

Type: `string`\
*Required*

### `checked`

Tell a Micropub client whether this syndicator should be enabled by default.

Type: `boolean`\
*Optional*, defaults to `false`
