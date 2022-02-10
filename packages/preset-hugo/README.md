# @indiekit/preset-hugo

Indiekit preset for Hugo-based websites.

## Installation

`npm i @indiekit/preset-hugo`

## Usage

Add `@indiekit/preset-hugo` to your list of plugins, specifying options as required:

```json
{
  "plugins": ["@indiekit/preset-hugo"],
  "@indiekit/preset-hugo": {
    "frontMatterFormat": "json"
  }
}
```

## Options

| Option              | Type     | Description                                                                            |
| :------------------ | :------- | :------------------------------------------------------------------------------------- |
| `frontMatterFormat` | `string` | Front matter format to use (`json`, `toml` or `yaml`). _Optional_, defaults to `yaml`. |
