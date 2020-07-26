# @indiekit/config-hugo

Indiekit config for Hugo-based websites.

## Installation

`npm i @indiekit/config-hugo`

## Configuration

```js
const HugoConfig = require('@indiekit/config-hugo');

const hugo = new HugoConfig({
  // config options here
});
```

### Options

* `frontmatterFormat`: Frontmatter format to use (`json`, `toml` or `yaml`). *Optional*, defaults to `yaml`.
