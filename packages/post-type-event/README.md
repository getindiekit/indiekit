# @indiekit/post-type-event

Event post type for Indiekit.

## Installation

`npm install @indiekit/post-type-event`

## Usage

Add `@indiekit/post-type-event` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-event"],
  "@indiekit/post-type-event": {
    "name": "Event"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
