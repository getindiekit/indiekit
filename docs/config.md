## Usage

Having deployed IndieKit to your own server, you’ll no doubt want to customise certain aspects of it. Configuration is provided via `indiekit.json`, a JSON file saved in the root of your repository (you can change this location via the `INDIEKIT_CONFIG_PATH` environment variable). This file lets you customise where posts are saved, how they are formatted and what URLs they will appear at.

### Configuration options

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
  Location of post type templates within your repository. Note, this should not be the template used to render your site (using Jekyll, 11ty, Hugo, etc.), but a template specifically for the use of IndieKit. Defaults to templates provided by IndieKit, [which you can find here](https://github.com/paulrobertlloyd/indiekit/tree/master/app/templates).

* ##### `post`
  Where posts should be saved to in your repository. Defaults to `_<post-type>/{​{ published | date('yyyy-MM-dd') }}-{​{ slug }}.md` e.g. <samp>_notes/2019-02-21-12345.md</samp>.

  To maintain compatability with Jekyll, the `article` post type saves to the `_posts` folder.

* ##### `file`
  Where media files should be saved to in your repository. Defaults to `images/<post-type>/{​{ published | date('yyyy/MM/dd') }}/{​{ slug }}/{{ filename }}` e.g. <samp>images/notes/2019/02/21/12345/98765.jpg</samp>.

  To match the default permalink style used for articles, `article/` is ommitted from the generated media folder path.

  Additional variables are available to media files:

  * `originalname` is the original name of the attached file, e.g. <samp>brighton-pier.jpg</samp>.
  * `filename` is a zero-filled two-digit number with file extension, e.g. <samp>03.jpg</samp>.
  * `fileext` is the file extension, which is taken from the attached file, e.g. <samp>.jpg</samp>.

* ##### `url`
  Permalink of post as it appears on your website. Defaults to `<post-type>/{​{ published | date('yyyy/MM/dd') }}/{​{ slug }}` e.g. <samp>notes/2019/02/21/12345</samp>.

  To maintain compatability with Jekyll, the `article` post type is ommited from the generated path, e.g. <samp>2019/02/21/my-great-post</samp>.

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
