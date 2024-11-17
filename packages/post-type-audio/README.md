# @indiekit/post-type-audio

Audio post type for Indiekit.

## Installation

`npm install @indiekit/post-type-audio`

## Usage

Add `@indiekit/post-type-audio` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-audio"],
  "@indiekit/post-type-audio": {
    "name": "Audio"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
