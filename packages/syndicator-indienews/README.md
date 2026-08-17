# @indiekit/syndicator-indienews

[IndieNews](https://news.indieweb.org) syndicator for Indiekit.

IndieNews is a community aggregator for posts about the IndieWeb. Unlike API-based syndicators, IndieNews discovers content via [Webmention](https://indieweb.org/Webmention) — syndication is triggered when your post links to an IndieNews channel URL and sends a Webmention to it.

This syndicator writes the IndieNews channel URL into the `syndication` property of your post at creation time, so that it appears in your post's markup and can be picked up by your Webmention sending setup.

## Installation

`npm install @indiekit/syndicator-indienews`

## Usage

Add `@indiekit/syndicator-indienews` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/syndicator-indienews"],
  "@indiekit/syndicator-indienews": {
    "language": "en"
  }
}
```

When you create a post with `mp-syndicate-to: https://news.indieweb.org/en/`, Indiekit will write `https://news.indieweb.org/en/` into the `syndication` property of your post. Your Webmention sender can then notify IndieNews.

### Multiple languages

To offer syndication to multiple IndieNews language channels, pass an array of options:

```json
{
  "plugins": ["@indiekit/syndicator-indienews"],
  "@indiekit/syndicator-indienews": [
    { "language": "en" },
    { "language": "es" }
  ]
}
```

Each entry appears as a separate syndication target in your Micropub client.

## Options

Each options object (or the single options object) supports:

| Option     | Type     | Description                                                                                                    |
| :--------- | :------- | :------------------------------------------------------------------------------------------------------------- |
| `language` | `string` | IndieNews language channel to syndicate to. _Optional_, defaults to `"en"`. See [IndieNews](https://news.indieweb.org) for available languages. |
| `checked`  | `boolean`| Tell a Micropub client whether this syndicator should be enabled by default. _Optional_, defaults to `false`.  |

