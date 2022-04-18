---
parent: Customisation
nav_order: 3
---

# Post types

Micropub clients let you publish a variety of [post types](https://indieweb.org/posts#Types_of_Posts), and Indiekit lets you decide how these different types are handled. You can do this by using a publication preset, configuring values manually, or a combination of both.

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

{% include post-types.md %}

## Path and URL tokens

{% include tokens.md %}
