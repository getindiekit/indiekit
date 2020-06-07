# Website configuration

{{ application.name }} lets you customise where posts are saved, how they are formatted and what permalinks they will have.

Configuration is provided via a JSON file. You can let {{ application.name }} know where to find this file by adding a custom configuration URL in [publication settings](/settings/publication).

## Configuration options

`categories`: A [list of categories clients can expose in their publishing interface](https://github.com/indieweb/micropub-extensions/issues/5). Defaults to `[]`. There are two ways of giving this information:

* a pre-detirminded array of values:

  ```json
  categories: [
    "indieweb",
    "indiewebcamp"
  ]
  ```

* adding the `url` of a JSON file that has an array of values:

  ```json
  categories: {
    "url": "{{ publication.me }}/categories.json"
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

* {{ icon('article') }} [Article](https://indieweb.org/article)
* {{ icon('note') }} [Note](https://indieweb.org/note)
* {{ icon('bookmark') }} [Bookmark](https://indieweb.org/bookmark)
* {{ icon('photo') }} [Photo](https://indieweb.org/photo)
* {{ icon('audio') }} [Audio](https://indieweb.org/audio)
* {{ icon('video') }} [Video](https://indieweb.org/video)
* {{ icon('checkin') }} [Checkin](https://indieweb.org/checkin)
* {{ icon('event') }} [Event](https://indieweb.org/event)
* {{ icon('like') }} [Like](https://indieweb.org/like)
* {{ icon('repost') }} [Repost](https://indieweb.org/repost)
* {{ icon('reply') }} [Reply](https://indieweb.org/reply) (with optional [RSVP](https://indieweb.org/rsvp))

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

* **`name`**: The name you use for this post type on your own site. You needn’t specify this value, but some Micropub clients will use it in their publishing interfaces.

* **`icon`**: Shortcode for the emoji icon to use in commit messages. A [full list of emoji codes can be found here](https://www.webfx.com/tools/emoji-cheat-sheet/).

* **`template`**: Where {{ application.name }} can find the post type template within your repository. Note, this is not a template that will be used to render your site, but one that tells {{ application.name }} how to save content. Typically this will be as a Markdown file with YAML frontmatter.

* **`post.path`**: Where posts should be saved in your repository.

* **`post.url`**: Permalink (the URL path) for posts on your website.

* **`media.path`**: Where media files should be saved in your repository. This applies only to `photo`, `video` and `audio` post types.

  The following template variables are available for media files:

  * `originalname`: Original name of the posted file, e.g. <samp>brighton-pier.jpg</samp>.
  * `filename`: Five character long alpha-numeric string with file extension, e.g. <samp>b3dog.jpg</samp>.
  * `fileext`: File extension taken from the posted file, e.g. <samp>jpg</samp>.
  * `filedate`: The ([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)) date the image was uploaded, e.g. <samp>2019-03-02T22:28:56+00:00</samp>. Best used with the `date()` filter, as described below.

* **`media.url`**: Public accessible URL for media files. This can use the same template variables as `media.path`. If no value is provided, defaults to `media.path`.

`slug-separator`: The character(s) to use when generating post slugs. Defaults to `-` (dash).

## Creating custom paths and URLs

Both `path` and `url` values use [Nunjucks](https://mozilla.github.io/nunjucks/) templating to allow customisation. All properties provided in a Micropub request are available. To customise date values, use the `date()` filter with [Luxon formatting tokens](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens).

## Creating post templates

Post templates also use [Nunjucks](https://mozilla.github.io/nunjucks/). All properties provided in a Micropub request are available.

A few points to consider when creating post templates:

* Microformat properties containing hyphens (i.e. `bookmark-of`, `in-reply-to`), are made available to templates with camelCased variable names (i.e. `bookmarkOf`, `inReplyTo`).

* Use [the `safe` filter](https://mozilla.github.io/nunjucks/templating.html#safe) where you want to output HTML content. Here’s an example:

  ```yaml
  ---
  title: '{​{ title }}'
  date: {​{ published }}
  bookmark-of: {​{ bookmarkOf }}
  {%- if category %}
  categories:
  {%- for item in category %}
  - {​{ item }}
  {%- endfor %}
  {%- endif %}
  ---
  {​{ content | safe }}
  ```
