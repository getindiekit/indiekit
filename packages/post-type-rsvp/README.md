# @indiekit/post-type-rsvp

RSVP post type for Indiekit.

## Installation

`npm install @indiekit/post-type-rsvp`

## Usage

Add `@indiekit/post-type-rsvp` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-rsvp"],
  "@indiekit/post-type-rsvp": {
    "name": "RSVP"
  }
}
```

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
