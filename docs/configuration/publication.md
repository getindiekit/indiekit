# Publication options

The following properties in the `publication` configuration option are used to provide information to Indiekit about a publication and how to interact with it.

## `categories`

A list of categories or tags used on your website. Can be an array of values, or a URL pointing to the location of a JSON file that provides an array of values.

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

## `enrichPostData`

A boolean to determine if data about URLs referenced in new posts is fetched and appended to a post’s properties.

Defaults to `false`.

When enabled, Indiekit will try to fetch Microformats data for any URL in a new post (for example URLs for `bookmark-of`, `like-of`, `repost-of`, `in-reply-to`).

If any data is found, a `references` property will be included in the resulting post data. For example, given the following Micropub request:

```sh
POST /micropub HTTP/1.1
Host: indiekit.mywebsite.com
Content-Type: application/x-www-form-urlencoded
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

## `locale`

A [ISO 639-1 language code](https://en.wikipedia.org/wiki/ISO_639-1) representing the language used by the publication. Currently used to format dates.

Defaults to `"en"` (English).

## `me`

Your website’s URL.

<Badge type="info" text="Required" />

## `postTemplate`

A post template is a function that takes post properties received and parsed by the Micropub endpoint and renders them in a given file format, for example, a Markdown file with YAML front matter.

Defaults to MF2 JSON.

See [customising a post template →](post-template.md)

## `postTypes`

A keyed collection of configuration properties for different post types. For example:

````json
{
  "postTypes": {
    "note": {
      "name": "Journal entry",
      "post": {
        "path": "_journal/{yyyy}-{MM}-{dd}-{slug}.md",
        "url": "journal/{yyyy}/{MM}/{slug}"
      }
    },
    "photo": {
      "name": "Photograph",
      "post": {
        "path": "_photos/{yyyy}-{MM}-{dd}-{slug}.md",
        "url": "photos/{yyyy}/{MM}/{slug}"
      },
      "media": {
        "path": "media/photos/{yyyy}/{filename}"
      }
    }
  }
}
````

Some of these values may already be set by a preset plugin or any post type plugins, but you can overwrite any configuration values they have set.

See [customising post types →](post-types.md)

### Properties

`name`
: A string representing the name you use for this post type on your own site. You needn’t specify this value, but some Micropub clients use this value in their publishing interfaces.

`h`
: A string representing the [Microformat vocabulary](http://microformats.org/wiki/microformats2#v2_vocabularies) to use. Defaults to `entry`.

`discovery`
: A string representing the field name to use when identifying incoming Micropub requests.

`fields`
: An object containing [FieldType](/plugins/api/add-post-type.md#fieldtype) objects, optionally with a `required` property, and keyed by field name. For example:

  ```json
  {
    "name": "Journal entry",
    "fields": {
      "content": { "required": true },
      "categories": { "required": true },
      "location": {}
    }
  }
  ```

`post`
: An object containing options for how post files should be stored.

  `path`
  : A string representing where posts should be saved in your content store.

  `url`
  : A string representing a permalink (or URL path) format for posts on your website.

`media`
: An object containing options for how media files should be stored.

  `path`
  : A string representing where media files should be saved in your content store.

  `url`
  : A string representing the public accessible URL for media files.

## `slugSeparator`

A string representing the character used to replace spaces when creating a slug.

Defaults to `"-"` (hyphen).

## `storeMessageTemplate`

A function that can be used to customise messages used when saving files to content stores that save messages with each change, for example git repositories.

Defaults to `[action] [postType] [fileType]`.

See [customising commit messages →](commit-messages.md)
