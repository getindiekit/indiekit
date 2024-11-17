# @indiekit/post-type-bookmark

Bookmark post type for Indiekit.

## Installation

`npm install @indiekit/post-type-bookmark`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/post-type-bookmark` to your configuration, specifying options as required:

```json
{
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
