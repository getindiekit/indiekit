# @indiekit/endpoint-json-feed

Syndicate posts from Indiekit using [JSON Feed](https://www.jsonfeed.org).

## Installation

`npm i @indiekit/endpoint-json-feed`

## Usage

Add `@indiekit/endpoint-json-feed` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-json-feed"],
  "@indiekit/endpoint-share": {
    "fileName": "posts.json",
    "mountPath": "/feeds",
  },
}
```

## Options

| Option      | Type     | Description                                      |
| :---------- | :------- | :----------------------------------------------- |
| `feedName`  | `string` | File name. _Optional_, defaults to `/feed.json`. |
| `mountPath` | `string` | Path to JSON Feed. _Optional_, defaults to `/`.  |
