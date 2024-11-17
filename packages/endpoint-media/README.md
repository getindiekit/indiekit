# @indiekit/endpoint-media

Micropub media endpoint for Indiekit. Enables publishing media files (audio, photos, videos) to your website using the Micropub protocol.

## Installation

`npm install @indiekit/endpoint-media`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-media` to your configuration, specifying options as required:

```jsonc
{
  "@indiekit/endpoint-media": {
    "imageProcessing": {
      "resize": {
        "width": 320,
        "height": 320,
      },
    },
    "mountPath": "/medien", // de-DE
  },
}
```

## Options

| Option                   | Type     | Description                                                                 |
| :----------------------- | :------- | :-------------------------------------------------------------------------- |
| `imageProcessing`        | `object` | Image processing options. Only supports resizing for now.                   |
| `imageProcessing.resize` | `object` | Sharp [image resizing options](https://sharp.pixelplumbing.com/api-resize). |
| `mountPath`              | `string` | Path to listen to media upload requests. _Optional_, defaults to `/media`.  |

## Supported endpoint queries

- Previously published media: `/media?q=source`

  Supports `filter`, `limit` and `offset` and parameters. For example, `/media?q=source&filter=web&limit=10&offset=10`.
