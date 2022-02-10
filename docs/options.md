---
nav_order: 3
---

# Configuration

{: .no_toc }

Indiekit uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find and load your configuration object. Starting from the current working directory, it looks for the following possible sources:

- a `indiekit` property in package.json
- a `.indiekitrc` file
- a `indiekit.config.js` file exporting a JS object
- a `indiekit.config.cjs` file exporting a JS object. When running indiekit in JavaScript packages that specify `"type":"module"` in their `package.json`

The search stops when one of these is found, and Indiekit uses that object. You can use the `--config` CLI option to short-circuit the search.

The `.indiekitrc` file (without extension) can be in JSON or YAML format. You can add a filename extension to help your text editor provide syntax checking and highlighting:

- `.indiekitrc.json`
- `.indiekitrc.yaml` / `.indiekitrc.yml`
- `.indiekitrc.js`

The configuration object has the following properties:

- TOC
  {:toc}

## application

### application.locale `string`

The language used in the application interface.

_Optional_, defaults to system language if supported, else `"en"` (English). For example:

```json
{
  "application": {
    "locale": "de"
  }
}
```

See [Localisation →](customisation/localisation.md)

---

### application.mongodbUrl `URL`

To cache files and save information about previously posts and files, you will need to connect Indiekit to a MongoDB database. You can [host one on MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

_Optional_, defaults to `process.env.MONGODB_URL`. For example:

```json
{
  "application": {
    "mongodbUrl": "mongodb+srv://<USER>:<PASS>@<HOST>/<DATABASE>"
  }
}
```

{% include_relative _includes/option-contains-secrets.md %}

---

### application.name `string`

The name of your server.

_Optional_, defaults to `"Indiekit"`. For example:

```json
{
  "application": {
    "name": "My IndieWeb Server"
  }
}
```

---

### application.themeColor `string`

Accent colour used in the application interface.

_Optional_, defaults to `"#0055ee"`. For example:

```json
{
  "application": {
    "themeColor": "#663399"
  }
}
```

---

### application.themeColorScheme `string`

Color scheme used in the application interface, `"automatic"`, `"light"` or `"dark"`.

_Optional_, defaults to `"automatic"`. For example:

```json
{
  "application": {
    "themeColorScheme": "dark"
  }
}
```

---

### application.url `string`

The URL of your server. Useful if Indiekit is running behind a reverse proxy.

_Optional_, defaults to the URL of your server (as provided by request headers). For example:

```json
{
  "application": {
    "url": "https://server.website.example"
  }
}
```

---

## plugins

TBD

---

## publication

### publication.categories `Array | URL`

A list of categories or tags used on your website. Can be an array of values, or the location of a JSON file providing an array of values.

_Optional_.

Example, using an array:

```json
{
  "publication": {
    "categories": ["sport", "technology", "travel"]
  }
}
```

Example, using a URL:

```json
{
  "publication": {
    "categories": "https://website.example/categories.json"
  }
}
```

---

### publication.locale `string`

Your publication’s locale. Currently used to format dates.

_Optional_, defaults to `"en"` (English). For example:

```json
{
  "publication": {
    "locale": "de"
  }
}
```

---

### publication.me `URL`

Your website’s URL.

_Required_. For example:

```json
{
  "publication": {
    "me": "https://website.example"
  }
}
```

---

### publication.mediaEndpoint `URL`

Indiekit provides a [media endpoint](https://micropub.spec.indieweb.org/#media-endpoint), but you can use a third-party endpoint by setting a value for this option.

_Optional_. For example:

```json
{
  "publication": {
    "mediaEndpoint": "https://media.website.example"
  }
}
```

---

### publication.postTemplate `Function`

A post template is a function that takes post properties received and parsed by the Micropub endpoint and renders them in a given file format, for example, a Markdown file with YAML front matter.

_Optional_, defaults to MF2 JSON. For example:

```js
// indiekit.config.cjs
import { myPostTemplate } from "./my-post-template.js";

export default {
  publication: {
    postTemplate: myPostTemplate,
  },
};
```

{% include_relative _includes/option-js-only.md %}

See [customising a post template →](customisation/post-template.md)

---

### publication.postTypes `Array`

A set of default paths and templates for different post types.

_Optional if using a preset_. For example:

```json
"publication": {
  "postTypes": [{
    "type": "note",
    "name": "Journal entry",
    "post": {
      "path": "_journal/{yyyy}-{MM}-{dd}-{slug}.md",
      "url": "journal/{yyyy}/{MM}/{slug}"
    }
  }]
}
```

See [customising post types →](customisation/post-types.md)

---

### publication.slugSeparator `string`

The character used to replace spaces when creating a slug.

_Optional_, defaults to `"-"` (hyphen). For example:

```json
{
  "publication": {
    "slugSeparator": "_"
  }
}
```

---

### publication.storeMessageTemplate `Function`

Function used to customise message format.

_Optional_, defaults to `[action] [postType] [fileType]`. For example:

```js
export default {
  publication: {
    storeMessageTemplate: (metaData) =>
      `🤖 ${metaData.result} a ${metaData.postType} ${metaData.fileType}`,
  },
};
```

{% include_relative _includes/option-js-only.md %}

See [customising commit messages →](customisation/commit-messages.md)

---

### publication.timeZone `string`

The time zone for your publication. By default this is set to `"UTC"`, however if you want to offset dates according to your time zone you can provide [a time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). This option also accepts a number of other values.

_Optional_, defaults to `"UTC"`. For example:

```json
{
  "publication": {
    "timeZone": "Europe/Berlin"
  }
}
```

See [customising the time zone →](customisation/time-zone.md)

---

### publication.tokenEndpoint `URL`

An IndieAuth token endpoint.

_Optional_, defaults to `"https://tokens.indieauth.com/token"`. For example:

```json
{
  "publication": {
    "tokenEndpoint": "https://tokens.example.org/token"
  }
}
```
