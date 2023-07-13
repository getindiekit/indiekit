# Post template

A post template takes post properties received and parsed by the Micropub endpoint and renders them in a given file format, for example, a Markdown file with YAML front matter.

The `postTemplate()` method takes one argument, `properties`, which contains the derived properties for a post, for example:

```js
{
  published: '2020-02-02',
  name: 'What I had for lunch',
  content: 'I ate a cheese sandwich, which was nice.',
}
```

The `postTemplate()` method determines how this data will get formatted.

To change the post format, make sure your configuration is provided as a JavaScript object. JSON and YAML formats are not supported.

You can then provide a formatting function for `publication.postTemplate`. For example, if you wanted to output a post format used by [Kirby](https://getkirby.com), you might write the following function:

```js
export default {
  publication: {
    postTemplate: (properties) => {
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
    },
  },
};
```

::: info
To use this `export` syntax, add `"type": "module"` to your project’s `package.json`.
:::

This would then generate the following file:

```txt
---
Date: 2020-02-02
---
Title: What I had for lunch
---
Text: I ate a cheese sandwich, which was nice.
```

You can see examples of this function being used in the Jekyll and Hugo publication presets:

- [`postTemplate()` function in Jekyll preset](https://github.com/getindiekit/indiekit/blob/main/packages/preset-jekyll/index.js)
- [`postTemplate()` function in Hugo preset](https://github.com/getindiekit/indiekit/blob/main/packages/preset-hugo/index.js)
