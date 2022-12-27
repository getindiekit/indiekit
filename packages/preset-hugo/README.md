# @indiekit/preset-hugo

[Hugo](https://gohugo.io) publication preset for Indiekit.

## Installation

`npm i @indiekit/preset-hugo`

## Usage

Add `@indiekit/preset-hugo` to your list of plug-ins, specifying options as required:

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
