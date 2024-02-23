# Separate endpoints for Micropub API and management interfaces

Date: 2022-06-12

## Status

Accepted

## Context

The Micropub and Micropub media endpoints provide responses to API calls as well as management interfaces for viewing (and later managing) posts and files.

However, this presents a number of issues:

- the shape of the Micropub API is quite constraining. To serve a list of files on the root path, would involve either negotiating the requested content type, or serving this view on a separate path (i.e. `/media/files`).

- the name of the path in the management interface is determined by that used for API calls. It is convention to use `/micropub` for a Micropub endpoint, but that name doesn’t make much sense in a user-facing interface.

- Indiekit allows you to use different Micropub and media endpoints instead of those enabled by default. As both post and file management interfaces could operate independently of the bundled endpoints, it makes sense for their functionality to be truly isolated.

## Decision

Use separate endpoints for Micropub APIs and management interfaces. The management interfaces will interact with the API endpoints using Micropub API.

## Consequences

The 2 existing plug-ins will be split into 4. By default requests will be served on the following paths:

- `/media` - Micropub media API (served by `endpoint-media`)
- `/files` - Interface for managing files (served by `endpoint-files`)
- `/micropub` - Micropub API (served by `endpoint-micropub`)
- `/posts` - Interface for managing posts (served by `endpoint-posts`)

When considering supporting future IndieWeb specifications (i.e Webmention), a similar division of concerns may also be appropriate.
