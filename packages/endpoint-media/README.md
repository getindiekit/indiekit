# @indiekit/endpoint-media

Micropub media endpoint for Indiekit. Enables publishing media files (audio, photos, videos) to your website using the Micropub protocol.

## Installation

`npm i @indiekit/endpoint-media`

## Usage

Add `@indiekit/endpoint-media` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-media"],
  "@indiekit/endpoint-media": {
    "mountPath": "/medien", // de-DE
  },
}
```

## Options

| Option      | Type     | Description                                                                |
| :---------- | :------- | :------------------------------------------------------------------------- |
| `mountPath` | `string` | Path to listen to media upload requests. _Optional_, defaults to `/media`. |

## Supported endpoint queries

- Previously published media: `/media?q=source`

  Supports `filter`, `limit` and `offset` and parameters. For example, `/media?q=source&filter=web&limit=10&offset=10`.
