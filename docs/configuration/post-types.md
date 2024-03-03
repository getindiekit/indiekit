# Post types

The Micropub API lets you publish a variety of [post types](../concepts#post-type), and Indiekit lets you decide how these different types are handled.

Post types can be configured in a few different ways. In order of priority:

1. [`publication.postTypes`](publication#posttypes) configuration
2. a [publication preset plug-in](/plugins/presets)
3. a [post type plug-in](/plugins/post-types)

Publication preset plug-ins provide default values for where post and media files should be saved, as well as a post template that formats incoming properties according to the file format expected by that publication.

Post type plug-ins define the fields used to created and edit posts in Indiekit’s interface.

While both plug-in types set default values for post types, these can be changed by defining alternative values in `publication.postTypes`

For example, to use the Jekyll preset but override the location `note` and `event` post files are saved to, you would add the following to your configuration:

```json
{
  "plugins": [
    "@indiekit/post-type-event",
    "@indiekit/preset-jekyll"
  ],
  "publication": {
    "postTypes": {
      "note": {
        "name": "Journal",
        "post": {
          "path": "_journal/{yyyy}-{MM}-{dd}-{slug}.md",
          "url": "journal/{yyyy}/{MM}/{slug}"
        }
      },
      "event": {
        "name": "Calendar",
        "post": {
          "path": "_calendar/{yyyy}-{MM}-{dd}-{slug}.md",
          "url": "calendar/{yyyy}/{MM}/{slug}"
        }
      }
    }
  }
}
```

In addition, by setting values for `name` property for each post type, this overrides the default value provided by the `@indiekit/post-type-note` plug-in (installed by default) and the `@indiekit/post-type-event` plug-in.
