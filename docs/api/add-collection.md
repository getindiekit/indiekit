---
outline: deep
---

# `Indiekit.addCollection`

This method is enables plug-ins to add a new collection to the MongoDB database for storing data.

## Syntax

```js
new Indiekit.addCollection(name);
```

## Constructor

`name`
: Collection name. This cannot share the name of a collection added by another plug-in. Indiekit currently adds 2 collections: `posts` and `media`.
