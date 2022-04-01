---
parent: Architecture decisions
---

# Store post data as JF2

Date: 2021-01-10

## Status

Accepted

## Context

There are two formats for serializing post data:

- [mf2](https://microformats.org/wiki/microformats2-parsing) is the standard JSON serialization of microformats2.

- [JF2](https://jf2.spec.indieweb.org) is a simpler JSON serialization of microformats2, intended to be easier to consume than the standard JSON representation.

Indiekit deals with both of these formats, often interchangeably:

- The [Micropub protocol](https://micropub.spec.indieweb.org) uses mf2 for [creating new posts](https://micropub.spec.indieweb.org/#json-syntax) and [updating existing ones](https://micropub.spec.indieweb.org/#update), and Micropub endpoints MUST return the response as mf2 when [queried for source content](https://micropub.spec.indieweb.org/#source-content).

- JF2 is the serialization consumed by post and path templates, and frontend view templates.

- JF2 will likely be used in future [Webmention](https://www.w3.org/TR/webmention/) development, if only to maintain parity with [the webmention.io API](https://github.com/aaronpk/webmention.io#api) which uses JF2.

Given the need to work with both formats, several options were considered for which format should be used when storing previously published posts.

### Option 1: Store properties as MF2

#### Pros

- Each post has a single canonical resource representing its properties.

- mf2 is the serialization used by the Micropub protocol.

- There are a lot of tools and parsers that work with this format (for example [microformats-parser](https://github.com/aimee-gm/microformats-parser), [post-type-discovery](https://github.com/grantcodes/post-type-discovery)).

#### Cons

- The verbosity of mf2 makes it difficult to work with. As every property is stored as an array, the existence of an array needs to be checked before checking for the existence of a value:

```js
// mf2
if (mf2.properties.name && mf2.properties.name[0]) { … }

// JF2
if (jf2.name) { … }
```

This also means that any new value needs to be saved inside an array.

- Static site generators tend to save post properties using front matter (typically YAML), a flatter data structure that is closer in design to that of JF2.

### Option 2: Store properties as mf2 and JF2

#### Pros

- Indiekit can use whichever serialization format is most suitable; mf2 for Micropub requests and responses, JF2 for populating templates.

#### Cons

- Both serializations need to remain in sync.

- Duplication of the same information.

- Complexity; it’s proven difficult to know which serialization is being used by or within any given part of the application.

### Option 3: Store properties as JF2

#### Pros

- Each post has a single canonical resource representing its properties.

- Given its flatter structure, it’s easier to test for the existence of property values and easier to inspect saved documents in MongoDB.

- Establishes a direct relationship between properties stored in the database and those used to populate post and path templates.

- JF2 was found to be [the best format to share data about a publication’s recently published posts](0002-share-publication-state-using-jf2.md).

#### Cons

- Need to convert incoming Micropub requests from mf2 to JF2, and convert queries for source content from JF2 to mf2.

- Possible side-effects updating posts.

- Need to write a native implementation of post type discovery that works with JF2.

## Decision

Store properties as JF2.

Whatever choice is made, conversion between these two formats will always be necessary. Having tried options 1 and 2 (and experienced friction building the application with both approaches) option 3 is worth trying before considering more complex approaches.

## Consequences

Post data will be stored exclusively using the JF2 serialization. Updating existing posts should not be affected, however, this has not been tested (backwards compatibility is not a concern at this early stage of development).
