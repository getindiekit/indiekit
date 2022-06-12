# @indiekit/endpoint-share

Share endpoint for Indiekit. Inspired and developed from [an idea described by Max Böck](https://mxb.dev/blog/indieweb-link-sharing/).

## Installation

`npm i @indiekit/endpoint-share`

## Usage

Add `@indiekit/endpoint-share` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/endpoint-share"],
  "@indiekit/endpoint-share": {
    "mountPath": "/bookmark"
  }
}
```

## Options

| Option      | Type     | Description                                             |
| :---------- | :------- | :------------------------------------------------------ |
| `mountPath` | `string` | Path to share screen. _Optional_, defaults to `/share`. |
