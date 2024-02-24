# Use keyed collection for post type configuration

Date: 2024-02-24

## Status

Accepted

## Context

Previous to v1.0.0-beta.7, a publication’s post type configuration was provided as an array of objects:

```json
{
  "postTypes": [
    {
      "type": "article",
      "name": "Article"
    },
    {
      "type": "note",
      "name": "Note"
    }
  ]
}
```

This design was chosen to match the expected response from a [Micropub query for supported vocabularies](https://github.com/indieweb/micropub-extensions/issues/1).

However, this presents a number of downsides:

- it’s possible to define a post type’s configuration multiple times in the same array. This makes it harder to discern the desired outcome. For example, given the following configuration, what should a `note` post type be called?

  ```json
  {
    "postTypes": [
      {
        "type": "note",
        "name": "Note"
      },
      {
        "type": "note",
        "name": "Micro post"
      }
    ]
  }
  ```

  It is not possible to define configuration multiple times as objects cannot contain the same key twice.

- as post type configuration takes on more options, and from differing sources (post type plug-ins, publication preset plug-ins, user configuration) so it becomes harder to merge different values.

- it’s harder to access values for a given post type with an array, where an array’s `find()` method is needed:

  ```js
  postTypes.find(postType => postType.type === type)
  ```
  
  With a keyed collection, we can use the following:
  
  ```js
  postTypes[type]
  ```

A keyed object is clearer, less error prone, and easier to use. The response to a Micropub query needn’t define the design of internal models, especially where it can make the application less robust and more difficult to reason with.

## Decision

Use keyed collection for storing post type configuration objects, using the `type` value for keys, and removing `type` from individual post type configuration objects:

```json
{
  "postTypes": {
    "article": {
      "name": "Article"
    },
    "note": {
      "name": "Note"
    }
  }
}
```

## Consequences

- The response to a Micropub query for supported vocabularies should transform the keyed object into an array, using the key as the value for `type`.
- References to `postTypes` should be updated to get configuration values from an object, not an array.
- Documentation should be updated, and users informed of a breaking change in the release notes for v1.0.0-beta.8.
