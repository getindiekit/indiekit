# Options

Indiekit uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find and load a configuration file. Starting from the current working directory, it looks for the following possible sources:

- a `indiekit` property in `package.json`
- a `.indiekitrc` file
- a `indiekit.config.js` file exporting a JavaScript object
- a `indiekit.config.cjs` file exporting a JavaScript object (in projects that specify `"type":"module"` in `package.json`)

The search stops when one of these is found, and Indiekit uses that object. You can use the `--config` CLI option to short-circuit the search.

The `.indiekitrc` file (without extension) can be in JSON or YAML format. You can add a filename extension to help your text editor provide syntax checking and highlighting:

- `.indiekitrc.json`
- `.indiekitrc.yaml` / `.indiekitrc.yml`
- `.indiekitrc.js`

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

See [Localisation →](localisation.md)

### application.mongodbUrl `URL`

To cache files and save information about previously posts and files, you will need to connect Indiekit to a MongoDB database. You can [host one on MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

_Optional_, defaults to `false`. For example:

```json
{
  "application": {
    "mongodbUrl": "mongodb+srv://<USER>:<PASS>@<HOST>/<DATABASE>"
  }
}
```

<!--@include: .option-contains-secrets.md-->

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

### application.ttl `number`

Length of time to cache external data requests (in seconds).

_Optional_, defaults to `604800` (7 days). For example:

```json
{
  "application": {
    "ttl": 3600
  }
}
```

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

## plugins

An array of plug-ins you wish to use with Indiekit. For example:

```json
{
  "plugins": [
    "@indiekit/preset-jekyll",
    "@indiekit/store-github",
    "@indiekit/syndicator-mastodon",
    "@indiekit/syndicator-twitter",
  ],
}
```

Each plug-in may accept its own configuration options, and these should be provided under a key with the plug-in’s name. For example:

```json
{
  "@indiekit/preset-hugo": {
    "frontMatterFormat": "yaml"
  }
}
```

<!--@include: .plugin-secrets.md-->

Learn more about Indiekit’s [plug-in API](../plugins/api/index.md).

## publication

### publication.authorizationEndpoint `URL`

Authorisation endpoint.

_Optional_, defaults to `"https://indieauth.com/auth"`. For example:

```json
{
  "publication": {
    "authorizationEndpoint": "https://example.org/auth"
  }
}
```

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

### publication.enrichPostData `boolean`

Fetch and append data about URLs referenced in new posts.

_Optional_, defaults to `false`. For example:

```json
{
  "publication": {
    "enrichPostData": true
  }
}
```

When enabled, Indiekit will try to fetch Microformats data for any URL in a new post (for example URLs for `bookmark-of`, `like-of`, `repost-of`, `in-reply-to`).

If any data is found, a `references` property will be included in the resulting post data. For example, given the following Micropub request:

```bash
POST /micropub HTTP/1.1
Host: indiekit.mywebsite.com
Content-type: application/x-www-form-urlencoded
Authorization: Bearer XXXXXXX

h=entry
&content=This+made+me+very+hungry.
&bookmark-of=https://website.example/notes/123
```

should the note post at `https://website.example/notes/123` include Microformats, the following post data would be generated:

```js
{
  date: "2022-11-03T22:00:00",
  "bookmark-of": "https://website.example/notes/123",
  content: "This made me very hungry.",
  references: {
    "https://website.example/notes/123": {
      type: "entry",
      published: "2013-03-07",
      content: "I ate a cheese sandwich, which was nice.",
      url: "https://website.example/notes/123"
    }
  }
}
```

This referenced Microformats data could then be used in the design of your website to provide extra information about the content you are linking to.

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

<!--@include: .option-requires-js.md-->

See [customising a post template →](post-template.md)

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

See [customising post types →](post-types.md)

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

<!--@include: .option-requires-js.md-->

See [customising commit messages →](commit-messages.md)

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

See [customising the time zone →](time-zone.md)

### publication.tokenEndpoint `URL`

An IndieAuth token endpoint.

_Optional_, defaults to `"[application.url]/token"`. For example:

```json
{
  "publication": {
    "tokenEndpoint": "https://server.website.example/token"
  }
}
```
