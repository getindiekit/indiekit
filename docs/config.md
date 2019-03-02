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

IndieKit provides a set of default paths and [templates](https://github.com/paulrobertlloyd/indiekit/tree/master/app/templates) for `article`, `note` and `photo` post type creation. These defaults can be ammended, and new types can be added. For example, to override the note and photo post types, you would provide the following:

```json
{
  "post-types": [{
    "type": "note",
    "name": "Micro note",
    "path": {
      "template": "_micropub/templates/note.njk",
      "post": "_notes/{​{ published | date('yyyy-MM-dd') }}-{​{ slug }}.md",
      "url": "notes/{​{ published | date('yyyy/MM') }}/{{ slug }}"
    },
    "type": "photo",
    "name": "Photograph",
    "path": {
      "template": "_micropub/templates/photo.njk",
      "file": "media/photos/{​{ published | date('yyyy/MM') }}/{​{ filename }}",
      "post": "_photos/{​{ published | date('yyyy-MM-dd') }}-{​{ slug }}.md",
      "url": "photos/{​{ published | date('yyyy/MM') }}/{{ slug }}"
    }
  }]
}

```
* **`type`**: The type of post being configured. This value must match oneof the [common post-types used across by the IndieWeb](https://indieweb.org/posts#Types_of_Posts).

* **`name`**: The name you give to this post type on your own site. You needn’t specify this value, but if you do, certain Micropub clients will expose it in their publishing UI.

* **`path.template`**: Where IndieKit can find the post type template within your repository. Note, this is not the template used to render your site, but a template specifically for the use of IndieKit to render content (typically as a Markdown file with YAML frontmatter).

* **`path.post`**: Where posts should be saved to in your repository.

* **`path.file`**: Where media files should be saved to in your repository (for `photo`, `video` and `audio` types only). Additional variables are available to media files:

  * `originalname` is the original name of the attached file, e.g. <samp>brighton-pier.jpg</samp>.
  * `filename` is a zero-filled two-digit number with file extension, e.g. <samp>03.jpg</samp>.
  * `fileext` is the file extension, which is taken from the attached file, e.g. <samp>.jpg</samp>.

* **`url`**: Permalink of post as it appears on your website.

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
