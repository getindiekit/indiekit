# Website configuration

{{ application.name }} lets you customise where posts are saved, how they are formatted and what permalinks you will give them.

Configuration is provided via a JSON file. You can let {{ application.name }} know where to find this file by prviding a value for ‘Configuration file path’ in [publication settings](/settings/publication).

## Configuration options

`categories`: A [list of categories clients can expose in their publishing interface](https://github.com/indieweb/micropub-extensions/issues/5). Defaults to `[]`. There are two ways of providing these values:

* a pre-detirminded array of values:

  ```json
  categories: [
    "indieweb",
    "indiewebcamp"
  ]
  ```

* giving the `url` property the address of a JSON file that provides an array of values:

  ```json
  categories: {
    "url": "{{ pub.me }}/categories.json"
  }
  ```

`media-endpoint`: The URL for your preferred [media endpoint](https://www.w3.org/TR/micropub/#media-endpoint). Use this if you want another endpoint to respond to media upload requests. Defaults to `{{ application.url }}/media`.

`syndicate-to`: Information about [syndication targets](https://www.w3.org/TR/micropub/#h-syndication-targets). Defaults to `[]`. Example:

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

`post-types`: {{ application.name }} provides a set of default paths and templates for the following post types:

* 📄 [`article`](https://indieweb.org/article)
* 📔 [`note`](https://indieweb.org/note)
* 📷 [`photo`](https://indieweb.org/photo)
* 📹 [`video`](https://indieweb.org/video)
* 🎤 [`audio`](https://indieweb.org/audio)
* 💬 [`reply`](https://indieweb.org/reply) (with optional [`rsvp`](https://indieweb.org/rsvp))
* 👍 [`like`](https://indieweb.org/like)
* ♻️ [`repost`](https://indieweb.org/repost)
* 🔖 [`bookmark`](https://indieweb.org/bookmark)
* 🚩 [`checkin`](https://indieweb.org/checkin)
* 📅 [`event`](https://indieweb.org/event)

These defaults can be ammended, and new types can be added. For example, to override the `note` and `photo` post types, you would provide the following:

```json
{
  "post-types": [{
    "type": "note",
    "name": "Micro note",
    "icon": ":memo:",
    "template": "_micropub/templates/note.njk",
    "post": {
      "path": "_notes/{​{ published | date('yyyy-MM-dd') }}-{​{ slug }}.md",
      "url": "notes/{​{ published | date('yyyy/MM') }}/{​{ slug }}"
    },
  }, {
    "type": "photo",
    "name": "Photograph",
    "template": "_micropub/templates/photo.njk",
    "post": {
      "path": "_photos/{​{ published | date('yyyy-MM-dd') }}-{​{ slug }}.md",
      "url": "photos/{​{ published | date('yyyy/MM') }}/{​{ slug }}"
    },
    "media": {
      "path": "media/photos/{​{ published | date('yyyy/MM') }}/{​{ filename }}",
    }
  }]
}
```

* **`type`**: The IndieWeb [post type](https://indieweb.org/Category:PostType).

* **`name`**: The name you give to this post type on your own site. You needn’t specify this value, but if you do, certain Micropub clients will expose it in their publishing UI.

* **`icon`**: Shortcode for the emoji icon to use in commit messages. A [full list of emoji codes can be found here](https://www.webfx.com/tools/emoji-cheat-sheet/).

* **`template`**: Where {{ application.name }} can find the post type template within your repository. Note, this is not the template used to render your site, but a template specifically for the use of {{ application.name }} to render content (typically as a Markdown file with YAML frontmatter).

* **`post.path`**: Where posts should be saved to in your repository.

* **`post.url`**: Permalink of post as it appears on your website.

* **`media.path`**: Where media files should be saved to in your repository (for `photo`, `video` and `audio` types only). The following template variables are available for media files:

  * `originalname` is the original name of the attached file, e.g. <samp>brighton-pier.jpg</samp>.
  * `filename` is a five character long alpha-numeric string with file extension, e.g. <samp>b3dog.jpg</samp>.
  * `fileext` is the file extension, which is taken from the attached file, e.g. <samp>jpg</samp>.
  * `filedate` is the ([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)) date the image was uploaded, e.g. <samp>2019-03-02T22:28:56+00:00</samp>. Best used with the `date()` filter, as described below.

* **`media.url`**: Public accessible URL for media files. Has access to the same template variables as `media.path`. If no value is provided, defaults to `media.path`.

`slug-separator`: The character(s) to use when generating post slugs. Defaults to `-` (dash).

## Creating custom paths and URLs

Both `path` and `url` values use [Nunjucks](https://mozilla.github.io/nunjucks/) templating to enable customisation, for which all properties provided in a Micropub request are available. To customise date values, the `date()` filter can be used. This accepts the [formatting tokens offered by Luxon](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens).

## Creating templates

Like paths, templates use [Nunjucks](https://mozilla.github.io/nunjucks/), and also accept any values provided in a Micropub request. Additional variables may be made available at a later date.

A few points to consider when creating templates:

* Microformat properties containing hyphens (i.e. `bookmark-of`, `in-reply-to`), are made available to templates with camelCased variable names (i.e. `bookmarkOf`, `inReplyTo`).

* Use [the `safe` filter](https://mozilla.github.io/nunjucks/templating.html#safe) where you wish to output HTML content. Here’s an example:

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
