# @indiekit/endpoint-micropub

Micropub endpoint for Indiekit. Enables publishing content to your website using the Micropub protocol.

## Installation

`npm install @indiekit/endpoint-micropub`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-micropub` to your configuration, specifying options as required:

```json
{
  "@indiekit/endpoint-micropub": {
    "mountPath": "/publisher"
  }
}
```

## Options

| Option      | Type     | Description                                                               |
| :---------- | :------- | :------------------------------------------------------------------------ |
| `mountPath` | `string` | Path to listen to Micropub requests. _Optional_, defaults to `/micropub`. |

## Supported endpoint queries

- Configuration: `/micropub?q=config`
- Media endpoint location: `/micropub?q=media-endpoint`
- Available syndication targets (list): `/micropub?q=syndicate-to`
- Supported queries: `/micropub?q=config`
- Supported vocabularies (list): `/micropub?q=post-types`
- Publication categories (list): `/micropub?q=category`
- Previously published posts (list): `/micropub?q=source`
- Source content: `/micropub?q=source&url=WEBSITE_URL`

List queries support `filter`, `limit` and `offset` parameters. For example, `/micropub?q=category&filter=web&limit=10&offset=10`.

The list of published posts is paged with `after` and `before` rather than `offset`, and can be narrowed with `filter` (a case-insensitive match on a post’s name and content), `category` (posts with that category) and `post-type` (posts of that post type). For example, `/micropub?q=source&filter=web&category=indieweb&post-type=note&limit=10`.

A response that lists posts also carries a private `_count` property: the number of posts matching the query, which may be greater than the number of items on the page. Properties prefixed with an underscore are not part of the Micropub specification and are intended for Indiekit’s own interfaces.
