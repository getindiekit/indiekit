# @indiekit/endpoint-webmention-io

Webmention.io endpoint for Indiekit. View webmentions collected by the Webmention.io service.

## Installation

`npm i @indiekit/endpoint-webmention-io`

## Usage

Add `@indiekit/endpoint-webmention-io` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-webmention-io"],
  "@indiekit/endpoint-webmention-io": {
    "mountPath": "/webmentions",
  },
}
```

## Options

| Option      | Type     | Description                                                                                                           |
| :---------- | :------- | :-------------------------------------------------------------------------------------------------------------------- |
| `mountPath` | `string` | Path to management interface. _Optional_, defaults to `/webmentions`.                                                 |
| `token`     | `string` | [Webmention.io](https://webmention.io/settings) API token. _Required_, defaults to `process.env.WEBMENTION_IO_TOKEN`. |
