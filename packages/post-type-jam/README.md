# @indiekit/post-type-jam

Jam post type for Indiekit.

## Installation

`npm i @indiekit/post-type-jam`

## Usage

Add `@indiekit/post-type-jam` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-jam"],
  "@indiekit/post-type-jam": {
    "name": "Jam"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
