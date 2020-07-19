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
    "template": "_micropub/templates/note.njk",
    "post": {
      "path": "_notes/{​yyyy}-{MM}-{dd}-{​slug}.md",
      "url": "notes/{yyyy}/{MM}/{​slug}"
    },
  }, {
    "type": "photo",
    "name": "Photograph",
    "template": "_micropub/templates/photo.njk",
    "post": {
      "path": "_photos/{​yyyy}-{MM}-{dd}-{​slug}.md",
      "url": "photos/{yyyy}/{MM}/{​slug}"
    },
    "media": {
      "path": "media/photos/{​yyyy}/{​filename}",
    }
  }]
}
```

* **`type`**: The IndieWeb [post type](https://indieweb.org/Category:PostType).

* **`name`**: The name you use for this post type on your own site. You needn’t specify this value, but some Micropub clients will use it in their publishing interfaces.

* **`template`**: Where {{ application.name }} can find the post type template within your repository. Note, this is not a template that will be used to render your site, but one that tells {{ application.name }} how to save content. Typically this will be as a Markdown file with YAML frontmatter.

* **`post.path`**: Where posts should be saved in your repository.

* **`post.url`**: Permalink (the URL path) for posts on your website.

* **`media.path`**: Where media files should be saved in your repository. This applies only to `photo`, `video` and `audio` post types.

* **`media.url`**: Public accessible URL for media files. This can use the same template variables as `media.path`. If no value is provided, defaults to `media.path`.

`slug-separator`: The character(s) to use when generating post slugs. Defaults to `-` (dash).

## Creating custom paths and URLs

Both `path` and `url` values can accept a number of tokens to allow their customisation.

### Posts

The following template tokens are available for post paths and URLs:

| Token  | Description                                                         |
| ------ | ------------------------------------------------------------------- |
| `slug` | Provided value, derived from `name` or a 5 character string, eg <samp>ycf9o</samp> |

### Media files

The following template tokens are available for media file paths and URLs:

| Token          | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `basename`     | 5 character alpha-numeric string, eg <samp>w9gwi</samp>     |
| `ext`          | File extension of uploaded file, eg <samp>jpg</samp>        |
| `filename`     | `basename` plus `ext`, eg <samp>w9gwi.jpg</samp>            |
| `originalname` | Original name of uploaded file, eg <samp>flower.jpg</samp>  |

### Dates

The following date tokens are available for both post and media paths and URLs:

| Token  | Description                                                         |
| ------ | ------------------------------------------------------------------- |
| `y`    | Calendar year, eg <samp>2020</samp>                                 |
| `yyyy` | Calendar year (zero padded), eg <samp>2020</samp>                   |
| `M`    | Month number, eg <samp>9</samp>                                     |
| `MM`   | Month number (zero padded), eg <samp>09</samp>                      |
| `MMM`  | Month name (abbreviated), eg <samp>Sep</samp>                       |
| `MMMM` | Month name (wide), eg <samp>September</samp>                        |
| `w`    | Week number, eg <samp>1</samp>                                      |
| `ww`   | Week number (zero padded), eg <samp>01</samp>                       |
| `D`    | Day of the year, eg <samp>1</samp>                                  |
| `DDD`  | Day of the year (zero padded), eg <samp>001</samp>                  |
| `D60`  | Day of the year (sexageismal), eg <samp>57h</samp>                  |
| `d`    | Day of the month, eg <samp>1</samp>                                 |
| `dd`   | Day of the month (zero padded), eg <samp>01</samp>                  |
| `h`    | Hour (12-hour-cycle), eg <samp>1</samp>                             |
| `hh`   | Hour (12-hour-cycle, zero padded), eg <samp>01</samp>               |
| `H`    | Hour (24-hour-cycle), eg <samp>1</samp>                             |
| `HH`   | Hour (24-hour-cycle, zero padded), eg <samp>01</samp>               |
| `m`    | Minute, eg <samp>1</samp>                                           |
| `mm`   | Minute (zero padded), eg <samp>01</samp>                            |
| `s`    | Second, eg <samp>1</samp>                                           |
| `t`    | UNIX epoch seconds, eg <samp>512969520</samp>                       |
| `T`    | UNIX epoch milliseconds, eg <samp>51296952000</samp>                |

## Creating post templates

Post templates use [Nunjucks](https://mozilla.github.io/nunjucks/). All properties provided in a Micropub request are available.

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
