# Creating a post template

A post template is a function that takes post properties received and parsed by the Micropub endpoint and renders them in a given file format, for example, a Markdown file with YAML frontmatter. You can see examples of this function in the Jekyll and Hugo presets:

* [`postTemplate()` function in Jekyll preset](https://github.com/getindiekit/indiekit/blob/main/packages/preset-jekyll/index.js#L120)
* [`postTemplate()` function in Hugo preset](https://github.com/getindiekit/indiekit/blob/main/packages/preset-hugo/index.js#L152)
