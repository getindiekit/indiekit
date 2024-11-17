# @indiekit/endpoint-posts

Post management endpoint for Indiekit. View posts published by your Micropub endpoint and publish new posts to it.

## Installation

`npm install @indiekit/endpoint-posts`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

Add `@indiekit/endpoint-posts` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-posts"],
  "@indiekit/endpoint-posts": {
    "mountPath": "/artikel", // de-DE
  },
}
```

## Options

| Option      | Type     | Description                                                     |
| :---------- | :------- | :-------------------------------------------------------------- |
| `mountPath` | `string` | Path to management interface. _Optional_, defaults to `/posts`. |
