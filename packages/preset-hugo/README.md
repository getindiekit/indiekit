# @indiekit/preset-hugo

Indiekit preset for Hugo-based websites.

## Installation

`npm i @indiekit/preset-hugo`

## Usage

```js
const HugoPreset = require('@indiekit/preset-hugo');

const hugo = new HugoPreset({
  // config options here
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `frontMatterFormat` | `string` | Front matter format to use (`json`, `toml` or `yaml`). *Optional*, defaults to `yaml`. |
