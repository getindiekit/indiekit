# @indiekit/store-file-system

Store IndieWeb content on your local file system.

## Installation

`npm i @indiekit/store-file-system`

## Usage

Add `@indiekit/store-file-system` to your list of plugins, specifying options as required:

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
