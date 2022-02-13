# @indiekit/endpoint-image

Image resizing endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-image`

## Usage

Add `@indiekit/endpoint-image` to your list of plugins, specifying options as required:

```json
{
  "plugins": ["@indiekit/endpoint-image"],
  "@indiekit/endpoint-image": {
    "mountPath": "/resize"
  }
}
```

## Options

| Option      | Type     | Description                                                        |
| :---------- | :------- | :----------------------------------------------------------------- |
| `mountPath` | `string` | Path to image resizing endpoint. _Optional_, defaults to `/image`. |
