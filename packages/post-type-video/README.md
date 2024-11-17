# @indiekit/post-type-video

Video post type for Indiekit.

## Installation

`npm install @indiekit/post-type-photo`

## Usage

Add `@indiekit/post-type-video` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-video"],
  "@indiekit/post-type-video": {
    "name": "Video"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
