# @indiekit/post-type-recipe

Recipe post type for Indiekit.

## Installation

`npm i @indiekit/post-type-recipe`

## Usage

Add `@indiekit/post-type-recipe` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-recipe"],
  "@indiekit/post-type-recipe": {
    "name": "Recipe"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
