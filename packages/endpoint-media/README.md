# @indiekit/endpoint-media

Micropub media endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-media`

## Usage

```js
const MediaEndpoint = require('@indiekit/endpoint-media');

const mediaEndpoint = new MediaEndpoint({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `mountPath` | `string` | Path to listen to media upload requests. *Optional*, defaults to `/media`. |

## Supported endpoint queries

* Previously published media: `/media?q=source`

  Supports `filter`, `limit` and `offset` and parameters. For example, `/media?q=source&filter=web&limit=10&offset=10`.
