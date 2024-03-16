---
outline: deep
---

# `Indiekit.addPreset`

A [publication preset](../../concepts.md#publication-preset) can set default storage locations and URL formats for [post types](../../concepts.md#post-type), and post templates for a given publication, be that a static site generator, content management system or other publishing software.

## Syntax

```js
new Indiekit.addPreset(options);
```

## Constructor

`options`
: An object used to customise the behaviour of the plug-in.

## Properties

`info`
: An object representing information about the preset. **Required**.

  The `info` property should return the following values:

  `name`
  : The name of the publishing software the plug-in supports. **Required**.

`postTypes`
: An object providing default configuration values for publication [post types](../../configuration/post-types.md).

## Methods

### `postTemplate()`

An (async) function providing a [post template](../../configuration/post-template.md).

### `init()`

Used to register the plug-in. Accepts an `Indiekit` instance to allow its modification before returning.

#### Parameters

`properties`
: Object containing properties for a post, that conform to the [JF2 Post Serialisation Format](https://jf2.spec.indieweb.org).

#### Return value

A string representing the file content that should be saved to a content store.

## Example

```js
export default class ExamplePreset {
  constructor() {
    this.name = "Example preset";
  }

  get info() {
    return {
      name: "Example",
    };
  }

  get postTypes() {
    return {
      note: {
        post: {
          path: "_content/notes/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "notes/{yyyy}/{MM}/{slug}"
        }
      }
    };
  }

  postTemplate(properties) {
    // Return post properties as a JSON string
    return JSON.stringify(properties);
  }

  init(Indiekit) {
    const { publication } = Indiekit.config;

    Indiekit.addPreset(this);
  }
}
```

### Add preset information

Indiekit’s web interface expects a preset plugin to provide some information about the publication or content management system it supports. This is provided by the `info` property:

```js
get info() {
  return {
    name: "Example application",
  };
}
```

### Add post type defaults

A publication preset defines default store and URL path values for a publication’s [post types](../../concepts.md#post-type). Users can override these in their own [configuration](../../configuration/post-types.md).

For example, to add default values for `note` and `photo` post types:

```js
get postTypes() {
  return {
    note: {
      post: {
        path: "notes/{yyyy}-{MM}-{dd}-{slug}.md",
        url: "notes/{yyyy}/{MM}/{slug}"
      }
    },
    photo: {
      post: {
        path: "photos/{yyyy}-{MM}-{dd}-{slug}.md",
        url: "photos/{yyyy}/{MM}/{slug}"
      },
      media: {
        path: "media/photos/{yyyy}/{filename}"
      }
    }
  };
}
```

### Add a post template

A post template takes properties received and parsed by the Micropub endpoint and renders them in a given file format, for example a Markdown file with YAML front matter.

For example, if you wanted to use the text file format used by [Kirby](https://getkirby.com), you might create the following function:

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

Assuming the incoming JF2 properties were as follows:

```js
{
  published: "2020-02-02",
  name: "What I had for lunch",
  content: "I ate a cheese sandwich, which was nice."
}
```

Then the `postTemplate()` method would translate this into the following:

```txt
---
Date: 2020-02-02
---
Title: What I had for lunch
---
Text: I ate a cheese sandwich, which was nice.
```

## See also

Example publication preset plug-in implementations:

- [`@indiekit/preset-jekyll`](https://github.com/getindiekit/indiekit/tree/main/packages/preset-jekyll) provides post types and a post template for Jekyll-based websites.

- [`@indiekit/preset-hugo`](https://github.com/getindiekit/indiekit/tree/main/packages/preset-hugo) provides post types and a post template (that accepts an option for the type of front matter format to be used) for Hugo-based websites.
