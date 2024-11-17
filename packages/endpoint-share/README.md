# @indiekit/endpoint-share

Share endpoint for Indiekit. Provides a simple interface for bookmarking websites and publishing them on your website. Inspired and developed from [an idea originally described by Max Böck](https://mxb.dev/blog/indieweb-link-sharing/).

## Installation

`npm install @indiekit/endpoint-share`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-share` to your configuration, specifying options as required:

```jsonc
{
  "@indiekit/endpoint-share": {
    "mountPath": "/teilen", // de-DE
  },
}
```

## Options

| Option      | Type     | Description                                             |
| :---------- | :------- | :------------------------------------------------------ |
| `mountPath` | `string` | Path to share screen. _Optional_, defaults to `/share`. |
