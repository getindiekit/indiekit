# @indiekit/post-type-article

Article post type for Indiekit.

## Installation

`npm install @indiekit/post-type-article`

## Usage

Add `@indiekit/post-type-article` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-article"],
  "@indiekit/post-type-article": {
    "name": "Article"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
