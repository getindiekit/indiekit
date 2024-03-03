# Configuration

Indiekit uses [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) to find and load a configuration file.

Starting from the current working directory, it looks for the following possible sources:

- a `indiekit` property in `package.json`
- a `.indiekitrc` file
- a `indiekit.config.js` file exporting a JavaScript object

The search stops when one of these is found, and Indiekit uses that object. You can use the `--config` CLI option to short-circuit the search.

The `.indiekitrc` file (without extension) can be in JSON or YAML format. You can add a filename extension to help your text editor provide syntax checking and highlighting:

- `.indiekitrc.json`
- `.indiekitrc.yaml` / `.indiekitrc.yml`
- `.indiekitrc.js`

## Options

Indiekit’s configuration file uses the following top-level properties:

- [`application`](application.md), an object containing configuration for the server and application interface,
- [`publication`](publication.md), an object containing information about a publication, and how Indiekit should interact with it,
- `plugins`, an array used to register [plug-ins](../plugins/index.md),
- and finally, each plug-in may accept its own configuration options, and these should be provided under a key with the plug-in’s name.

  > [!WARNING]
  > Plug-ins may include options that require private information such as passwords or API keys to be given. It’s recommended that you store these values in environment (or configuration) variables which can only be seen by you and the application.

## Example

```json
{
  "application": {
    "locale": "de",
    "name": "Unabhängigkeit"
  },
  "publication": {
    "locale": "de",
    "me": "https://website.example",
    "postTypes": {
      "event": {
        "name": "Veranstaltungen"
      }
    }
  },
  "plugins": [
    "@indiekit/post-type-event",
    "@indiekit/preset-hugo"
  ],
  "@indiekit/preset-hugo": {
    "frontMatterFormat": "yaml"
  }
}
```

[This example configuration](https://github.com/getindiekit/example-config) can be used as a starting point for configuring your own Indiekit server.
