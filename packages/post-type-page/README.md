# @indiekit/post-type-page

Page post type for Indiekit. A page is an undated post at the root of your website, such as `/about`, `/now` or `/uses`.

## Installation

`npm install @indiekit/post-type-page`

## Usage

Add `@indiekit/post-type-page` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/post-type-page"],
  "@indiekit/post-type-page": {
    "name": "Page"
  }
}
```

Micropub clients create a page by sending `h=page`. Presets write a page to the root of your content, where your static site generator serves it at `/{slug}`.

## Options

| Option   | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `name`   | `string` | Post type name.                   |
| `fields` | `Array`  | Fields to show in post interface. |
