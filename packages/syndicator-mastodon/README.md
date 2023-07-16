# @indiekit/syndicator-mastodon

[Mastodon](https://joinmastodon.org) syndicator for Indiekit.

## Installation

`npm i @indiekit/syndicator-mastodon`

## Requirements

A set of Mastodon API keys. You can get these from `/settings/applications` on your Mastodon server.

## Usage

Add `@indiekit/syndicator-mastodon` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/syndicator-mastodon"],
  "@indiekit/syndicator-mastodon": {
    "url": "https://mastodon.server",
    "user": "username",
    "checked": true,
    "forced": true
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

| Option           | Type      | Description                                                                                                   |
| :--------------- | :-------- | :------------------------------------------------------------------------------------------------------------ |
| `accessToken`    | `string`  | Your Mastodon access token. _Required_, defaults to `process.env.MASTODON_ACCESS_TOKEN`.                      |
| `url`            | `string`  | Your Mastodon server, i.e. `https://mastodon.social`. _Required_.                                             |
| `user`           | `string`  | Your Mastodon username (without the `@`). _Required_.                                                         |
| `characterLimit` | `number`  | Maximum number of characters before a post is truncated. _Optional_, defaults to `500`.                       |
| `checked`        | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. _Optional_, defaults to `false`. |
| `forced`         | `boolean` | Ignore the presence or value of `checked` and always syndicate. _Optional_.                                   |
