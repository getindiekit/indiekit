# @indiekit/syndicator-bluesky

[Bluesky](https://bsky.social) syndicator for Indiekit.

## Installation

`npm i @indiekit/syndicator-bluesky`

## Usage

Add `@indiekit/syndicator-bluesky` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/syndicator-bluesky"],
  "@indiekit/syndicator-bluesky": {
    "handle": "username.bsky.social",
    "password": "password",
    "checked": true
  }
}
```

## Options

| Option             | Type      | Description                                                                                                                 |
| :----------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `handle`           | `string`  | Your Bluesky handle (without the `@`). _Required_.                                                                          |
| `password`         | `string`  | Your Bluesky password. _Required_, defaults to `process.env.BLUESKY_PASSWORD`.                                              |
| `profileUrl`       | `string`  | Bluesky profile URL prefix. Used in the URL returned in syndicated URLs. _Optional_, defaults to `https://bsky.app/profile` |
| `serviceUrl`       | `string`  | Bluesky service URL. Used to connect to a Bluesky service API. _Optional_, defaults to `https://bsky.social`                |
| `checked`          | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. _Optional_, defaults to `false`.               |
| `includePermalink` | `boolean` | Always include a link to the original post. _Optional_, defaults to `false`.                                                |
