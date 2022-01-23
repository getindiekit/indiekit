# @indiekit/syndicator-mastodon

Syndicate IndieWeb content to a Mastodon server.

## Installation

`npm i @indiekit/syndicator-mastodon`

## Requirements

A set of Mastodon API keys. You can get these from `/settings/applications` on your Mastodon server.

## Usage

```js
const MastodonSyndicator = require('@indiekit/syndicator-mastodon');

const mastodon = new MastodonSyndicator({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `accessToken` | `string` | Your Mastodon access token. *Required*, defaults to `process.env.MASTODON_ACCESS_TOKEN`. |
| `url` | `string` | Your Mastodon server, i.e. `https://mastodon.social`. *Required*. |
| `user` | `string` | Your Mastodon username (without the `@`). *Required*. |
| `checked` | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. *Optional*, defaults to `false`. |
| `forced` | `boolean` | Ignore the presence or value of `checked` and always syndicate. *Optional*. |
