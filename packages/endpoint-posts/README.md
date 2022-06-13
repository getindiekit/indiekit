# @indiekit/endpoint-posts

Post management endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-posts`

## Usage

Add `@indiekit/endpoint-posts` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-posts"],
  "@indiekit/endpoint-posts": {
    "mountPath": "/artikel" // de-DE
  }
}
```

## Options

| Option      | Type     | Description                                                     |
| :---------- | :------- | :-------------------------------------------------------------- |
| `mountPath` | `string` | Path to management interface. _Optional_, defaults to `/posts`. |
