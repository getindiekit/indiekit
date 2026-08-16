# @indiekit/syndicator-bluesky

[Bluesky](https://bsky.social) syndicator for Indiekit.

## Installation

`npm install @indiekit/syndicator-bluesky`

## Requirements

A Bluesky [app password](https://bsky.app/settings/app-passwords). This plug-in does not require access to your direct messages.

> [!IMPORTANT]
> Store your app password in an environment variable called `BLUESKY_PASSWORD` so that only you and the application can see it.

## Usage

Add `@indiekit/syndicator-bluesky` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/syndicator-bluesky"],
  "@indiekit/syndicator-bluesky": {
    "handle": "username.bsky.social",
    "checked": true
  }
}
```

Enabling the `includeCategories` option adds a post’s categories to the end of the post as hashtags, which Bluesky turns into tag facets:

```text
I ate a cheese sandwich, which was nice.

#lunch #cheesesandwiches
```

Characters Bluesky doesn’t recognise as part of a tag are removed, and only the last segment of a hierarchical category is used, so `holidays/family trips` becomes `#familytrips`. Any hashtag already written into the post content is not repeated.

## Options

| Option              | Type      | Description                                                                                                                 |
| :------------------ | :-------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `handle`            | `string`  | Your Bluesky handle (without the `@`). _Required_.                                                                          |
| `password`          | `string`  | A Bluesky app password. _Required_, defaults to `process.env.BLUESKY_PASSWORD`.                                             |
| `profileUrl`        | `string`  | Bluesky profile URL prefix. Used in the URL returned in syndicated URLs. _Optional_, defaults to `https://bsky.app/profile` |
| `serviceUrl`        | `string`  | Bluesky service URL. Used to connect to a Bluesky service API. _Optional_, defaults to `https://bsky.social`                |
| `checked`           | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. _Optional_, defaults to `false`.               |
| `includeCategories` | `boolean` | Add a post’s categories to the end of the post as hashtags. _Optional_, defaults to `false`.                                |
| `includePermalink`  | `boolean` | Always include a link to the original post. _Optional_, defaults to `false`.                                                |
