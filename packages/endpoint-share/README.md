# @indiekit/endpoint-share

Share endpoint for Indiekit. Provides a simple interface for bookmarking websites and publishing them on your website. Inspired and developed from [an idea originally described by Max Böck](https://mxb.dev/blog/indieweb-link-sharing/).

## Installation

`npm i @indiekit/endpoint-share`

## Usage

Add `@indiekit/endpoint-share` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-share"],
  "@indiekit/endpoint-share": {
    "mountPath": "/teilen" // de-DE
  }
}
```

## Options

| Option      | Type     | Description                                             |
| :---------- | :------- | :------------------------------------------------------ |
| `mountPath` | `string` | Path to share screen. _Optional_, defaults to `/share`. |
