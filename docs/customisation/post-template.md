---
parent: Customisation
nav_order: 4
---

# Post template

A post template is a function that takes post properties received and parsed by the Micropub endpoint and renders them in a given file format, for example, a Markdown file with YAML front matter.

The `postTemplate` takes one argument, `properties`. Indiekit will pass an object containing the derived data for a post:

```js
{
  published: '2020-02-02',
  name: 'What I had for lunch',
  content: 'I ate a cheese sandwich, which was nice.',
}
```

Your post template function determines how this data will get transformed. For example, if you wanted to output a format used by Kirby, you might write the following function:

```js
// my-post-template.js
export const myPostTemplate = properties => {
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

You can then reference this function in your config file:

```js
// indiekit.config.cjs
import {myPostTemplate} from './my-post-template.js';

export default {
  publication: {
    postTemplate: myPostTemplate,
  },
}
```

This would then generate the following file:

```text
---
Date: 2020-02-02
---
Title: What I had for lunch
---
Text: I ate a cheese sandwich, which was nice.
```

You can see examples of this function being used in the Jekyll and Hugo publication presets:

* [`postTemplate()` function in Jekyll preset](https://github.com/getindiekit/indiekit/blob/main/packages/preset-jekyll/index.js)
* [`postTemplate()` function in Hugo preset](https://github.com/getindiekit/indiekit/blob/main/packages/preset-hugo/index.js)
