# @indiekit/syndicator-twitter

Syndicate IndieWeb content to Twitter.

## Installation

`npm i @indiekit/syndicator-twitter`

## Requirements

A set of Twitter API keys. You can get these from <https://developer.twitter.com>.

## Usage

Add `@indiekit/syndicator-twitter` to your list of plugins, specifying options as required:

```json
{
  "plugins": ["@indiekit/syndicator-twitter"],
  "@indiekit/syndicator-twitter": {
    "user": "username",
    "checked": true,
    "forced": true
  }
}
```

## Options

| Option              | Type      | Description                                                                                                   |
| :------------------ | :-------- | :------------------------------------------------------------------------------------------------------------ |
| `accessToken`       | `string`  | Your Twitter access token. _Required_, defaults to `process.env.TWITTER_ACCESS_TOKEN`.                        |
| `accessTokenSecret` | `string`  | Your Twitter access token secret. _Required_, defaults to `process.env.TWITTER_ACCESS_TOKEN_SECRET`.          |
| `apiKey`            | `string`  | Your Twitter API key. _Required_, defaults to `process.env.TWITTER_API_KEY`.                                  |
| `apiKeySecret`      | `string`  | Your Twitter API secret key. _Required_, defaults to `process.env.TWITTER_API_KEY_SECRET`.                    |
| `user`              | `string`  | Your Twitter username (without the `@`). _Required_.                                                          |
| `checked`           | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. _Optional_, defaults to `false`. |
| `forced`            | `boolean` | Ignore the presence or value of `checked` and always syndicate. _Optional_.                                   |
