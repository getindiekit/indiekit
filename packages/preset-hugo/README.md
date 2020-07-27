# @indiekit/preset-hugo

Indiekit preset for Hugo-based websites.

## Installation

`npm i @indiekit/preset-hugo`

## Configuration

```js
const HugoPreset = require('@indiekit/preset-hugo');

const hugo = new HugoPreset({
  // config options here
});
```

### Options

* `frontmatterFormat`: Frontmatter format to use (`json`, `toml` or `yaml`). *Optional*, defaults to `yaml`.
