---
parent: Architecture decisions
---

# Share publication state using JF2

Date: 2021-01-10

## Status

Accepted

## Context

When a post or media item is published using Indiekit’s Micropub endpoint, its permalink, path and derived properties are (optionally) saved to a database. Keeping a record means update, delete and undelete actions can be performed later, and source content queries can be answered.

However, authors may publish other posts manually or through other means, yet still want to interact with IndieWeb protocols – and therefore Indiekit – later. Syndication is a good example of this. When a post is syndicated, the `syndication` property needs to be updated with the location of the syndicated copy. Indiekit can only do this if it has a record of the post.

One way of achieving this is to query a publication before performing an action, getting a list of recently published posts, and checking for matches in the database. If there isn’t, Indiekit can then import information about this post into the database.

Publications typically publish several feeds already. Could Indiekit consume one these, or does it require something?

The following options were considered:

- [Atom](https://tools.ietf.org/html/rfc5023)/[RSS 2.0](https://www.rssboard.org/rss-specification): While widespread, these XML serializations would require additional dependencies in order to parse them. They also don’t share a vocabulary with microformats2.

- [JSON Feed](https://jsonfeed.org): While similar, this serialization doesn’t use the microformats2 vocabulary either. Furthermore, including properties outside of the JSON Feed vocabulary requires using its extension mechanism, which would complicate later serialization into either mf2 or JF2.

- [JF2 Feed](https://jf2.spec.indieweb.org/#jf2feed): A simpler JSON serialization of microformats2 intended to be easier to consume than the standard JSON representation ([mf2](https://microformats.org/wiki/microformats2-parsing)). This seems well suited to the job.

### A note about using mf2

It might be possible to achieve the same without needing a publication to generate an additional feed: Indiekit could query a JSON Feed, get the URL of a post, and then parse that webpage for its microformats.

However, not all properties are guaranteed to be present and certainly not those intended for parsing by Micropub servers, i.e. `mp-syndicate-to`. Having a separate feed means there can be an exclusive exchange of information between a publication and Indiekit.

## Decision

Use JF2 Feed.

## Consequences

Publications that want to share their state with Indiekit can publish a JF2 Feed. The `publication.jf2Feed` configuration property is used to inform Indiekit of its location.
