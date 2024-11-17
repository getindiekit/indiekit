# @indiekit/endpoint-image

Image resizing endpoint for Indiekit. Adds real-time image processing routes that can be used by your publication.

## Installation

`npm install @indiekit/endpoint-image`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-image` to your configuration, specifying options as required:

```jsonc
{
  "@indiekit/endpoint-image": {
    "mountPath": "/bild", // de-DE
  },
}
```

## Options

| Option      | Type       | Description                                                        |
| :---------- | :--------- | :----------------------------------------------------------------- |
| `cache`     | `Function` | [Keyv store](https://github.com/lukechilds/keyv).                  |
| `me`        | `string`   | Publication URL. Used as prefix to image paths.                    |
| `mountPath` | `string`   | Path to image resizing endpoint. _Optional_, defaults to `/image`. |
