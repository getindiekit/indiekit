# @indiekit/post-type-note

Note post type for Indiekit.

## Installation

`npm install @indiekit/post-type-note`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/post-type-note` to your configuration, specifying options as required:

```json
{
  "@indiekit/post-type-note": {
    "name": "Note"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
