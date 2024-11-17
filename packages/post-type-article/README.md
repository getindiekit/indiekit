# @indiekit/post-type-article

Article post type for Indiekit.

## Installation

`npm install @indiekit/post-type-article`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/post-type-article` to your configuration, specifying options as required:

```json
{
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
