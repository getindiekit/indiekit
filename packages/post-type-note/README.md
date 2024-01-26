# @indiekit/post-type-note

Note post type for Indiekit.

## Installation

`npm i @indiekit/post-type-note`

## Usage

Add `@indiekit/post-type-note` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-note"],
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
