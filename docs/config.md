## Usage

Once you have deployed IndieKit to your own server, next you need to configure your website. Configuration is provided via `indiekit.json`, a JSON file saved in the root of your repository (you can change this location by updating the `INDIEKIT_CONFIG_PATH` environment variable). This file lets you to customise where posts are saved, how they are formatted and what URLs they will appear at. But to get started, all you need to provide is the `url` of your website:

```json
{
  "url": "https://example.com/",
}
```

To enable automatic discovery of your Micropub (and token) endpoints, ensure the following values are included in your site’s `<head>`, providing the URL of your deployed application for the `micropub` value:

```html
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
<link rel="micropub" href="https://<your-endpoint>/micropub">
```

### Configuration options

#### `url`

The URL of the website where published files appear. **Required**.

#### `media-endpoint`

The URL for your preferred [media endpoint](https://www.w3.org/TR/micropub/#media-endpoint). Use this if you want another endpoint to respond to media upload requests. Defaults to `https://<your-endpoint>/media`.

#### `syndicate-to`

Information about [syndication targets](https://www.w3.org/TR/micropub/#h-syndication-targets). Defaults to `[]`. Example:

```json
{
  "syndicate-to": [{
    "uid": "https://twitter.com/paulrobertlloyd/",
    "name": "Paul Robert Lloyd on Twitter"
  }, {
    "uid": "https://mastodon.social/@paulrobertlloyd",
    "name": "Paul Robert Lloyd on Mastodon"
  }, {
    "uid": "https://micro.blog/paulrobertlloyd",
    "name": "Paul Robert Lloyd on Micro.blog"
  }]
}
```

#### `post-types`

An array of post-types (with default values currently provided for `article`, `note` and `photo`). Each type accepts the following values:

* ##### `template`
  Location of the post template in your repository. Note, this should not be the template used to render your site (using Jekyll, 11ty, Hugo, etc.), but a template specifically for the use of IndieKit. Defaults to templates provided by IndieKit, [which you can find here](https://github.com/paulrobertlloyd/indiekit/tree/master/app/templates).

* ##### `file`
  Location where posts should be saved to in your repository. Defaults to `_<post-type>/{​{ published | date('yyyy-MM-dd') }}-{​{ slug }}.md` e.g. `_notes/2019-02-21-12345.md`.

  To maintain compatability with Jekyll, the `article` post type saves to the `_posts` folder.

* ##### `url`
  Permalink of post as it appears on your website. Defaults to `<post-type>/{​{ published | date('yyyy/MM/dd') }}/{​{ slug }}` e.g. `notes/2019/02/21/12345`.

  To maintain compatability with Jekyll, the `article` post type is ommited from the generated path, e.g. `2019/02/21/my-great-post`.

Example:

```json
{
  "post-types": [{
    "article": {
      "template": "_layouts/indiekit/article.njk",
      "file": "_articles/{​{ published | date('yyyy-MM-dd') }}-{​{ slug }}.md",
      "url": "articles/{​{ published | date('yyyy/MM') }}/{​{ slug }}"
    },
    "note": {
      "template": "_layouts/indiekit/note.njk",
      "file": "_notes/{​{ published | date('X') }}.md",
      "url": "notes/{​{ published | date('X') }}"
    },
    "photo": {
      "template": "_layouts/indiekit/photo.njk",
      "file": "_photos/{​{ published | date('X') }}.md",
      "url": "photos/{​{ published | date('X') }}"
    }
  }]
}
```

#### `slug-separator`

The character(s) to use when generating post slugs. Defaults to `-` (dash).

### Creating custom paths

Both `file` and `url` paths use [Nunjucks](https://mozilla.github.io/nunjucks/) templating to enable customisation, for which all values provided in a Micropub request are available. To customise date values, the `date()` filter can be used. This accepts the [formatting tokens offered by Luxon](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens).

### Creating templates

Like paths, templates use [Nunjucks](https://mozilla.github.io/nunjucks/), and also accept any values provided in a Micropub request. Additional variables may be made available at a later date. Remember to use [the `safe` filter](https://mozilla.github.io/nunjucks/templating.html#safe) where you wish to output HTML content. Here’s an example:

```yaml
---
title: '{​{ title }}'
date: {​{ published }}
{%- if category %}
categories:
{%- for item in category %}
- {​{ item }}
{%- endfor %}
{%- endif %}
---
{​{ content | safe }}
```
