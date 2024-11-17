# @indiekit/post-type-photo

Photo post type for Indiekit.

## Installation

`npm install @indiekit/post-type-photo`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

Add `@indiekit/post-type-photo` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-photo"],
  "@indiekit/post-type-photo": {
    "name": "Photo"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
