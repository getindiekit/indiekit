# @indiekit/endpoint-posts

Post management endpoint for Indiekit. View posts published by your Micropub endpoint and publish new posts to it.

## Installation

`npm install @indiekit/endpoint-posts`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-posts` to your configuration, specifying options as required:

```jsonc
{
  "@indiekit/endpoint-posts": {
    "mountPath": "/artikel", // de-DE
  },
}
```

## Options

| Option      | Type     | Description                                                     |
| :---------- | :------- | :-------------------------------------------------------------- |
| `mountPath` | `string` | Path to management interface. _Optional_, defaults to `/posts`. |
