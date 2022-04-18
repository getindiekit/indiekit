| Name | Description |
| :--- | :---------- |
| `type` | The IndieWeb [post type](https://indieweb.org/Category:PostType). _Required_. |
| `name` | The name you use for this post type on your own site. You needn’t specify this value, but some Micropub clients use it in their publishing interfaces. _Required_. |
| `post.path` | Where posts should be saved in your content store. _Required_. |
| `post.url` | Permalink (the URL path) for posts on your website. _Required_. |
| `media.path` | Where media files should be saved in your content store. _Required_ for `photo`, `video` and `audio` post types only. |
| `media.url` | Public accessible URL for media files. This can use the same template variables as `media.path`. _Optional_, defaults to `media.path`. |
