# @indiekit/post-type-like

Like post type for Indiekit.

## Installation

`npm install @indiekit/post-type-like`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/post-type-like` to your configuration, specifying options as required:

```json
{
  "@indiekit/post-type-like": {
    "name": "Like"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
