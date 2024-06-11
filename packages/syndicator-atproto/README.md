# @indiekit/syndicator-atproto

[AT Protocol](https://atproto.com) syndicator for Indiekit.

## Installation

`npm i @indiekit/syndicator-atproto`

## Usage

Add `@indiekit/syndicator-atproto` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/syndicator-atproto"],
  "@indiekit/syndicator-atproto": {
    "url": "https://bsky.social",
    "user": "username.bsky.social",
    "password": "password",
    "checked": true
  }
}
```

## Options

| Option             | Type      | Description                                                                                                   |
| :----------------- | :-------- | :------------------------------------------------------------------------------------------------------------ |
| `password`         | `string`  | Your AT protocol password. _Required_, defaults to `process.env.ATPROTO_PASSWORD`.                            |
| `url`              | `string`  | Your AT protocol service, i.e. `https://bsky.social`. _Required_.                                             |
| `user`             | `string`  | Your AT protocol identifier (without the `@`). _Required_.                                                    |
| `checked`          | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. _Optional_, defaults to `false`. |
| `includePermalink` | `boolean` | Always include a link to the original post. _Optional_, defaults to `false`.                                  |
