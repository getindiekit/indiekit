# @indiekit/syndicator-mastodon

[Mastodon](https://joinmastodon.org) syndicator for Indiekit.

## Installation

`npm install @indiekit/syndicator-mastodon`

## Requirements

An Mastodon API access token. You can request one from `/settings/applications` on your Mastodon server.

> [!IMPORTANT]
> Store your API key in an environment variable called `MASTODON_ACCESS_TOKEN` so that only you and the application can see it.

> [!IMPORTANT]
> Mastodon access tokens do not expire.

## Usage

Add `@indiekit/syndicator-mastodon` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/syndicator-mastodon"],
  "@indiekit/syndicator-mastodon": {
    "url": "https://mastodon.server",
    "user": "username",
    "checked": true
  }
}
```

When sharing content to Mastodon using this syndicator, any post visibility setting will be used for the syndicated status:

| Micropub post visibility | Mastodon status visibility |
| ------------------------ | -------------------------- |
| Public                   | Public                     |
| Unlisted                 | Unlisted                   |
| Private                  | Followers only             |

## Options

| Option             | Type      | Description                                                                                                   |
| :----------------- | :-------- | :------------------------------------------------------------------------------------------------------------ |
| `accessToken`      | `string`  | Your Mastodon access token. _Required_, defaults to `process.env.MASTODON_ACCESS_TOKEN`.                      |
| `user`             | `string`  | Your Mastodon username (without the `@`). _Required_.                                                         |
| `url`              | `string`  | Your Mastodon server. _Optional_, defaults to `https://mastodon.social`.                                      |
| `characterLimit`   | `number`  | Maximum number of characters before a post is truncated. _Optional_, defaults to `500`.                       |
| `checked`          | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. _Optional_, defaults to `false`. |
| `includePermalink` | `boolean` | Always include a link to the original post. _Optional_, defaults to `false`.                                  |
