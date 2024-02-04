# Post types

The Micropub API lets you publish a variety of [post types](https://indieweb.org/posts#Types_of_Posts), and Indiekit lets you decide how these different types are handled. You can do this by using a publication preset, configuring values manually, or a combination of both.

For example, to use the Jekyll preset but override the `note` and `photo` post types, you would add the following to your configuration:

```json
{
  "plugins": ["@indiekit/preset-jekyll"],
  "publication": {
    "postTypes": [
      {
        "type": "note",
        "name": "Journal entry",
        "post": {
          "path": "_journal/{yyyy}-{MM}-{dd}-{slug}.md",
          "url": "journal/{yyyy}/{MM}/{slug}"
        }
      },
      {
        "type": "photo",
        "name": "Photograph",
        "post": {
          "path": "_photos/{yyyy}-{MM}-{dd}-{slug}.md",
          "url": "photos/{yyyy}/{MM}/{slug}"
        },
        "media": {
          "path": "media/photos/{yyyy}/{filename}"
        }
      }
    ]
  }
}
```

Each post type can take the following values:

| Property | Type | Description |
| :--- | :---------- | :---------- |
| `type` | `string` | The IndieWeb [post type](https://indieweb.org/Category:PostType). _Required_. |
| `name` | `string` | The name you use for this post type on your own site. You needn’t specify this value, but some Micropub clients use this value in their publishing interfaces. |
| `h` | `string` | Microformat vocabulary to use. _Optional_, defaults to `"entry"`. |
| `discovery` | `string` | Property to use for [post type discovery](https://www.w3.org/TR/post-type-discovery/). _Optional_. |
| `fields` | `Array[string]` | Which input fields to display in Indiekit’s publishing interface. Other Micropub clients may use these values in their publishing interfaces. |
| `requiredFields` | `Array[string]` | Which input fields are required. Other Micropub clients may use these values in their publishing interfaces. |
| `post.path` | `string` | Where posts should be saved in your content store. _Required_. |
| `post.url` | `string` | Permalink (the URL path) for posts on your website. _Required_. |
| `media.path` | `string` | Where media files should be saved in your content store. _Required_ |
| `media.url` | `string` | Public accessible URL for media files. This can use the same template variables as `media.path`. _Optional_, defaults to `media.path`. |

## Path and URL tokens

Values for `*.path` and `*.url` can be customised using the following tokens:

| Token | Path type | Description |
| :---- | :-------- | :---------- |
| `y` | `post` `media` | Calendar year, eg <samp>2020</samp> |
| `yyyy` | `post` `media` | Calendar year (zero-padded), eg <samp>2020</samp> |
| `M` | `post` `media` | Month number, eg <samp>9</samp> |
| `MM` | `post` `media` | Month number (zero-padded), eg <samp>09</samp> |
| `MMM` | `post` `media` | Month name (abbreviated), eg <samp>Sep</samp> |
| `MMMM` | `post` `media` | Month name (wide), eg <samp>September</samp> |
| `w` | `post` `media` | Week number, eg <samp>1</samp> |
| `ww` | `post` `media` | Week number (zero-padded), eg <samp>01</samp> |
| `D` | `post` `media` | Day of the year, eg <samp>1</samp> |
| `DDD` | `post` `media` | Day of the year (zero-padded), eg <samp>001</samp> |
| `D60` | `post` `media` | Day of the year (sexageismal), eg <samp>57h</samp> |
| `d` | `post` `media` | Day of the month, eg <samp>1</samp> |
| `dd` | `post` `media` | Day of the month (zero-padded), eg <samp>01</samp> |
| `h` | `post` `media` | Hour (12-hour-cycle), eg <samp>1</samp> |
| `hh` | `post` `media` | Hour (12-hour-cycle, zero-padded), eg <samp>01</samp> |
| `H` | `post` `media` | Hour (24-hour-cycle), eg <samp>1</samp> |
| `HH` | `post` `media` | Hour (24-hour-cycle, zero-padded), eg <samp>01</samp> |
| `m` | `post` `media` | Minute, eg <samp>1</samp> |
| `mm` | `post` `media` | Minute (zero-padded), eg <samp>01</samp> |
| `s` | `post` `media` | Second, eg <samp>1</samp> |
| `ss` | `post` `media` | Second (zero-padded), eg <samp>01</samp> |
| `t` | `post` `media` | UNIX epoch seconds, eg <samp>512969520</samp> |
| `T` | `post` `media` | UNIX epoch milliseconds, eg <samp>51296952000</samp> |
| `uuid` | `post` `media` | A [random UUID][uuid] |
| `slug` | `post` | Provided slug, slugified `name` or a 5 character string, eg <samp>ycf9o</samp> |
| `n`[^1] | `post` `media` | Incremental count of posts (for type) in the same day, eg <samp>1</samp> |
| `basename` | `media` | 5 character alpha-numeric string, eg <samp>w9gwi</samp> |
| `ext` | `media` | File extension of uploaded file, eg <samp>jpg</samp> |
| `filename` | `media` | `basename` plus `ext`, eg <samp>w9gwi.jpg</samp> |
| `originalname` | `media` | Original name of uploaded file, eg <samp>flower.jpg</samp> |

[^1]: Using the `n` token requires a [database to be configured](https://getindiekit.com/configuration/#application-mongodburl-url).

[uuid]: https://www.rfc-editor.org/rfc/rfc4122.html#section-4.4
