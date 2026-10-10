---
outline: deep
---

# `Indiekit.addCollection`

This method enables plug-ins to add a new collection to the MongoDB database for storing data, and to declare the indexes it needs.

## Syntax

```js
new Indiekit.addCollection(name, indexes);
```

## Constructor

`name`
: Collection name. This cannot share the name of a collection added by another plug-in. Indiekit currently adds 2 collections: `posts` and `media`.

`indexes`
: An array of indexes to create on the collection, each an object with a `key` and any options MongoDB’s `createIndex` accepts, such as `unique`. _Optional_. Indiekit creates them once it has connected to the database and before serving requests.

## Example

```js
Indiekit.addCollection("microsub_items", [
  { key: { channel: 1, id: 1 }, unique: true },
  { key: { channel: 1, url: 1 } },
]);
```
