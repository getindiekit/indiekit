# @indiekit/endpoint-media

Micropub media endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-media`

## Usage

Add `@indiekit/endpoint-media` to your list of plugins, specifying options as required:

```json
{
  "plugins": [
    "@indiekit/endpoint-media"
  ],
  "@indiekit/endpoint-media": {
    "mountPath": "/uploader"
  }
}
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `mountPath` | `string` | Path to listen to media upload requests. *Optional*, defaults to `/media`. |

## Supported endpoint queries

* Previously published media: `/media?q=source`

  Supports `filter`, `limit` and `offset` and parameters. For example, `/media?q=source&filter=web&limit=10&offset=10`.
