# `Indiekit.addPreset`

A [publication preset](../../concepts.md#publication-preset) plug-in sets default values for post types and provides a post template for a given publication, static site generator, content management system or other publishing application.

[[toc]]

## Constructor

<!--@include: .plugin-constructor.md-->

## Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| `info` | [`Object`][] | Information about the preset. _Required_. |
| `postTypes` | [`Array`][] | Default values for [post types](../../configuration/post-types.md). |

### `info`

Indiekit’s web interface expects a preset plugin to provide some information about the publication or content management system it supports. This is provided by the `info` property:

```js
get info() {
  return {
    name: "Example application",
  };
}
```

The `info` property returns the following values:

| Property | Type | Description |
| :------- | :--- | :---------- |
| `name` | [`String`][] | The name of the publishing application the preset supports. _Required_. |

### `postTypes`

The Micropub API lets you publish a variety of [post types](https://indieweb.org/posts#Types_of_Posts). A publication preset defines the default values for these post types, which users can override in their [configuration](../../configuration/post-types.md).

For example, to add default values for `note` and `photo` post types:

```js
get postTypes() {
  return [
    {
      "type": "note",
      "name": "Diary entry",
      "post": {
        "path": "diary/{yyyy}-{MM}-{dd}-{slug}.md",
        "url": "diary/{yyyy}/{MM}/{slug}"
      }
    },
    {
      "type": "photo",
      "name": "Image entry",
      "post": {
        "path": "images/{yyyy}-{MM}-{dd}-{slug}.md",
        "url": "images/{yyyy}/{MM}/{slug}"
      },
      "media": {
        "path": "media/images/{yyyy}/{filename}"
      }
    }
  ];
}
```

## Methods

| Method | Type | Description |
| :----- | :--- | :---------- |
| `postTemplate()` | [`AsyncFunction`][]/[`Function`][] | Default [post template](../../configuration/post-template.md). |

### `postTemplate()`

A post template takes post properties received and parsed by the Micropub endpoint and renders them in a given file format, for example, a Markdown file with YAML front matter.

The `postTemplate()` method takes one argument, `properties`, which contains the derived properties for a post, for example:

```js
{
  published: '2020-02-02',
  name: 'What I had for lunch',
  content: 'I ate a cheese sandwich, which was nice.',
}
```

The `postTemplate()` method determines how this data will get transformed. For example, if you wanted to output a format used by Kirby, you might provide the following function:

```js
postTemplate(properties) {
  let text;

  if (properties.published) {
    text += `\n---\nDate: ${properties.published}\n---`;
  }

  if (properties.name) {
    text += `\n---\nTitle: ${properties.name}\n---`;
  }

  if (properties.content) {
    text += `\n---\nText: ${properties.content}`;
  }

  return text;
}
```

This would then generate the following file:

```txt
---
Date: 2020-02-02
---
Title: What I had for lunch
---
Text: I ate a cheese sandwich, which was nice.
```

## Example

```js
export default class ExamplePreset {
  constructor() {
    this.id = "example-preset";
    this.meta = import.meta;
    this.name = "Example preset";
  }

  get info() {
    return {
      name: "Example",
    };
  }

  get postTypes() {
    return […];
  }

  postTemplate(properties) {…}

  init(Indiekit) {
    Indiekit.addPreset(this);
  }
}
```

Example publication preset plug-ins:

- [`@indiekit/preset-jekyll`](https://github.com/getindiekit/indiekit/tree/main/packages/preset-jekyll) provides post types and a post template for Jekyll-based websites.

- [`@indiekit/preset-hugo`](https://github.com/getindiekit/indiekit/tree/main/packages/preset-hugo) provides post types and a post template (that accepts an option for the type of front matter format to be used) for Hugo-based websites.

[`Array`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[`AsyncFunction`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction 
[`Function`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[`Object`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`String`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
