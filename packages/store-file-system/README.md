# @indiekit/store-file-system

File system content store adaptor for Indiekit.

## Installation

`npm i @indiekit/store-file-system`

## Usage

Add `@indiekit/store-file-system` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-file-system"],
  "@indiekit/store-file-system": {
    "directory": "project/www"
  }
}
```

## Options

| Option      | Type     | Description                                                                    |
| :---------- | :------- | :----------------------------------------------------------------------------- |
| `directory` | `string` | Directory to save files to. _Optional_, defaults to current working directory. |
