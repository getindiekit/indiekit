# Configuring post types

Micropub clients let you publish a variety of [post types](https://indieweb.org/Category:PostType), and Indiekit lets you decide how these different types are handled. You can do this by using a publication preset, configuring values manually, or a combination of both.

For example, to use the Jekyll preset but override the `note` and `photo` post types, you would use the following configuration:

```js
import {JekyllPreset} from '@indiekit/preset-jekyll';

// Use a preset
const jekyll = new JekyllPreset();
indiekit.set('publication.preset', jekyll);

// Override preset post type
indiekit.set('publication.postTypes', [{
  type: 'note',
  name: 'Journal entry',
  post: {
    path: '_journal/{​yyyy}-{MM}-{dd}-{​slug}.md',
    url: 'journal/{yyyy}/{MM}/{​slug}'
  },
}, {
  type: 'photo',
  name: 'Photograph',
  post: {
    path: '_photos/{​yyyy}-{MM}-{dd}-{​slug}.md',
    url: 'photos/{yyyy}/{MM}/{​slug}'
  },
  media: {
    path: 'media/photos/{​yyyy}/{​filename}',
  }
}]);
```

Each post type can take the following values:

* **`type`**: The IndieWeb [post type](https://indieweb.org/Category:PostType).

* **`name`**: The name you use for this post type on your own site. You needn’t specify this value, but some Micropub clients use it in their publishing interfaces.

* **`post.path`**: Where posts should be saved in your repository.

* **`post.url`**: Permalink (the URL path) for posts on your website.

* **`media.path`**: Where media files should be saved in your repository. This applies only to `photo`, `video` and `audio` post types.

* **`media.url`**: Public accessible URL for media files. This can use the same template variables as `media.path`. If no value is provided, defaults to `media.path`.

## Creating custom paths and URLs

Both `path` and `url` values can be customised using the following date tokens:

| Token  | Description                                           |
| :----- | :---------------------------------------------------- |
| `y`    | Calendar year, eg <samp>2020</samp>                   |
| `yyyy` | Calendar year (zero-padded), eg <samp>2020</samp>     |
| `M`    | Month number, eg <samp>9</samp>                       |
| `MM`   | Month number (zero-padded), eg <samp>09</samp>        |
| `MMM`  | Month name (abbreviated), eg <samp>Sep</samp>         |
| `MMMM` | Month name (wide), eg <samp>September</samp>          |
| `w`    | Week number, eg <samp>1</samp>                        |
| `ww`   | Week number (zero-padded), eg <samp>01</samp>         |
| `D`    | Day of the year, eg <samp>1</samp>                    |
| `DDD`  | Day of the year (zero-padded), eg <samp>001</samp>    |
| `D60`  | Day of the year (sexageismal), eg <samp>57h</samp>    |
| `d`    | Day of the month, eg <samp>1</samp>                   |
| `dd`   | Day of the month (zero-padded), eg <samp>01</samp>    |
| `h`    | Hour (12-hour-cycle), eg <samp>1</samp>               |
| `hh`   | Hour (12-hour-cycle, zero-padded), eg <samp>01</samp> |
| `H`    | Hour (24-hour-cycle), eg <samp>1</samp>               |
| `HH`   | Hour (24-hour-cycle, zero-padded), eg <samp>01</samp> |
| `m`    | Minute, eg <samp>1</samp>                             |
| `mm`   | Minute (zero-padded), eg <samp>01</samp>              |
| `s`    | Second, eg <samp>1</samp>                             |
| `ss`   | Second (zero-padded), eg <samp>01</samp>              |
| `t`    | UNIX epoch seconds, eg <samp>512969520</samp>         |
| `T`    | UNIX epoch milliseconds, eg <samp>51296952000</samp>  |

The following template tokens are available for post paths and URLs:

| Token  | Description                                                        |
| :----- | :----------------------------------------------------------------- |
| `slug` | Provided slug, slugified `name` or a 5 character string, eg <samp>ycf9o</samp> |
| `uuid` | A [random UUID][uuid]                                              |

The following template tokens are available for media file paths and URLs:

| Token          | Description                                                |
| :------------- | :--------------------------------------------------------- |
| `basename`     | 5 character alpha-numeric string, eg <samp>w9gwi</samp>    |
| `ext`          | File extension of uploaded file, eg <samp>jpg</samp>       |
| `filename`     | `basename` plus `ext`, eg <samp>w9gwi.jpg</samp>           |
| `originalname` | Original name of uploaded file, eg <samp>flower.jpg</samp> |
| `uuid`         | A [random UUID][uuid]                                      |

[uuid]: https://www.rfc-editor.org/rfc/rfc4122.html#section-4.4
