# @indiekit/post-type-repost

Repost post type for Indiekit.

## Installation

`npm i @indiekit/post-type-repost`

## Usage

Add `@indiekit/post-type-repost` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-repost"],
  "@indiekit/post-type-repost": {
    "name": "Repost"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
