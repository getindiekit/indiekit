# @indiekit/endpoint-micropub

Micropub endpoint for Indiekit. Enables publishing content to your website using the Micropub protocol.

## Installation

`npm install @indiekit/endpoint-micropub`

## Usage

Add `@indiekit/endpoint-micropub` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/endpoint-micropub"],
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

List queries support `filter`, `limit` and `offset` and parameters. For example, `/micropub?q=source&filter=web&limit=10&offset=10`.
