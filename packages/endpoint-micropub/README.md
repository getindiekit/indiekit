# @indiekit/endpoint-micropub

Micropub endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-micropub`

## Usage

```js
const MicropubEndpoint = require('@indiekit/endpoint-micropub');

const micropubEndpoint = new MicropubEndpoint({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `mountPath` | `string` | Path to listen to Micropub requests. *Optional*, defaults to `/micropub`. |

## Supported endpoint queries

* Configuration: `/micropub?q=config`
* Media endpoint location: `/micropub?q=media-endpoint`
* Available syndication targets (list): `/micropub?q=syndicate-to`
* Supported queries: `/micropub?q=config`
* Supported vocabularies (list): `/micropub?q=post-types`
* Publication categories (list): `/micropub?q=category`
* Previously published posts (list): `/micropub?q=source`
* Source content: `/micropub?q=source&url=WEBSITE_URL`

List queries support `filter`, `limit` and `offset` and parameters. For example, `/micropub?q=source&filter=web&limit=10&offset=10`.
