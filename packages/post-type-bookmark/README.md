# @indiekit/post-type-bookmark

Bookmark post type for Indiekit.

## Installation

`npm install @indiekit/post-type-bookmark`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

Add `@indiekit/post-type-bookmark` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-bookmark"],
  "@indiekit/post-type-bookmark": {
    "name": "Bookmark"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
