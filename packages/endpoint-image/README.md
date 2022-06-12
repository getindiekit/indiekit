# @indiekit/endpoint-image

Image resizing endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-image`

## Usage

Add `@indiekit/endpoint-image` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/endpoint-image"],
  "@indiekit/endpoint-image": {
    "mountPath": "/resize"
  }
}
```

## Options

| Option      | Type       | Description                                                        |
| :---------- | :--------- | :----------------------------------------------------------------- |
| `cache`     | `Function` | [Keyv store](https://github.com/lukechilds/keyv).                  |
| `me`        | `string`   | Publication URL. Used as prefix to image paths.                    |
| `mountPath` | `string`   | Path to image resizing endpoint. _Optional_, defaults to `/image`. |
