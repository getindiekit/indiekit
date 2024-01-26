# @indiekit/post-type-like

Like post type for Indiekit.

## Installation

`npm i @indiekit/post-type-like`

## Usage

Add `@indiekit/post-type-like` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-like"],
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
