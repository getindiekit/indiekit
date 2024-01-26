# @indiekit/post-type-reply

Reply post type for Indiekit.

## Installation

`npm i @indiekit/post-type-reply`

## Usage

Add `@indiekit/post-type-reply` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-reply"],
  "@indiekit/post-type-reply": {
    "name": "Reply"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
