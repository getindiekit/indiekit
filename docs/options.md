---
nav_order: 3
---

# Configuration options
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

* TOC
{:toc}

## application.locale `string`

The language used in the application interface.

*Optional*, defaults to system language if supported, else `en` (English).

See [Localisation →](customisation/localisation.md)

```js
indiekit.set('application.locale', 'en');
```

***

## application.mongodbUrl `URL`

To cache files and save information about previously posts and files, you will need to connect Indiekit to a MongoDB database. You can [host one on MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

*Optional*.

```js
indiekit.set('application.mongodbUrl', 'mongodb+srv://<USER>:<PASS>@<HOST>/<DATABASE>');
```

***

## application.name `string`

The name of your server.

*Optional*, defaults to `Indiekit`

```js
indiekit.set('application.name', 'Indiekit');
```

***

## application.themeColor `string`

Accent colour used in the application interface.

*Optional*, defaults to `#0055ee`.

```js
indiekit.set('application.themeColor', '#0055ee');
```

***

## application.themeColorScheme `string`

Color scheme used in the application interface, `automatic`, `light` or `dark`.

*Optional*, defaults to `automatic`.

```js
indiekit.set('application.themeColorScheme', 'automatic');
```

***

## application.url `string`

The URL of your server. Useful if Indiekit is running behind a reverse proxy.

*Optional*, defaults to the URL of your server (as provided by request headers).

```js
indiekit.set('application.url', 'https://server.website.example');
```

***

## publication.categories `Array | URL`

A list of categories or tags used on your website. Can be an array of values, or the location of a JSON file providing an array of values.

*Optional*.

Example, using an array:

```js
indiekit.set('application.categories', [
  'sport',
  'technology',
  'travel',
]);
```

Example, using a URL:

```js
indiekit.set('application.categories', 'https://website.example/categories.json');
```

***

## publication.locale `string`

Your publication’s locale. Currently used to format dates.

*Optional*, defaults to `en` (English).

```js
indiekit.set('publication.locale', 'en');
```

***

## publication.me `URL`

Your website’s URL.

*Required*.

```js
indiekit.set('publication.me', 'https://website.example');
```

***

## publication.mediaEndpoint `URL`

Indiekit provides a [media endpoint](https://micropub.spec.indieweb.org/#media-endpoint), but you can use a third-party endpoint by setting a value for this option.

*Optional*.

```js
indiekit.set('publication.mediaEndpoint', 'https://media.website.example');
```

***

## publication.postTemplate `Function`

A post template is a function that takes post properties received and parsed by the Micropub endpoint and renders them in a given file format, for example, a Markdown file with YAML front matter.

*Optional*, defaults to MF2 JSON.

See [customising a post template →](customisation/post-template.md)

***

## publication.postTypes `Array`

A set of default paths and templates for different post types.

*Optional if using a preset*.

See [customising post types →](customisation/post-types.md)

***

## publication.preset `Function`

A [publication preset](plug-ins.md#publication-presets) plug-in.

*Optional*.

***

## publication.slugSeparator `string`

The character used to replace spaces when creating a slug.

*Optional*, defaults to `-`.

```js
indiekit.set('publication.slugSeparator', '_');
```

***

## publication.store `Function`

A [content store](plug-ins.md#content-stores) plug-in.

*Required*.

***

## publication.storeMessageTemplate `Function`

Function used to customise message format.

*Optional*, defaults to `[action] [postType] [fileType]`.

See [customising commit messages →](customisation/commit-messages.md)

***

## publication.syndicationTargets `Array`

An array of [syndication targets](https://micropub.spec.indieweb.org/#syndication-targets).

*Optional*.

```js
indiekit.set('publication.syndicationTargets', [{
  uid: 'https://twitter.com/username/',
  name: 'Username on Twitter'
}, {
  uid: 'https://mastodon.social/@username',
  name: 'Username on Mastodon'
}]);
```

***

## publication.timeZone `string`

The time zone for your publication. By default this is set to `UTC`, however if you want to offset dates according to your time zone you can provide [a time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). This option also accepts a number of other values.

*Optional*, defaults to `UTC`.

```js
indiekit.set('publication.timeZone', 'Europe/London');
```

See [customising the time zone →](customisation/time-zone.md)

***

## publication.tokenEndpoint `URL`

An IndieAuth token endpoint.

*Optional*, defaults to `https://tokens.indieauth.com/token`.

```js
indiekit.set('publication.tokenEndpoint', 'https://tokens.example.org/token');
```
