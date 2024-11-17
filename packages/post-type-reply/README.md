# @indiekit/post-type-reply

Reply post type for Indiekit.

## Installation

`npm install @indiekit/post-type-reply`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/post-type-reply` to your configuration, specifying options as required:

```json
{
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
