# Endpoint queries

{{ application.name }} supports the endpoint queries [described in the Micropub standard](https://www.w3.org/TR/micropub/#querying) as well as others [proposed by the IndieWeb community](https://indieweb.org/Micropub-extensions).

## Micropub endpoint

* Configuration: [`/micropub?q=config`][config]
* Media endpoint location: [`/micropub?q=media-endpoint`][media-endpoint]
* Available syndication targets (list): [`/micropub?q=syndicate-to`][syndicate-to]
* Supported vocabularies (list): [`/micropub?q=post-types`][post-types]
* Publication categories (list): [`/micropub?q=category`][category]
* Previously published posts (list): [`/micropub?q=source`][source]
* Source content: [`/micropub?q=source&url=WEBSITE_URL`][source-url]

## Media endpoint

* Previously published media (list): [`/media?q=source`][media-source]

[config]: {{ application.url }}/micropub?q=config
[media-endpoint]: {{ application.url }}/micropub?q=media-endpoint
[syndicate-to]: {{ application.url }}/micropub?q=syndicate-to
[post-types]: {{ application.url }}/micropub?q=post-types
[category]: {{ application.url }}/micropub?q=category
[source]: {{ application.url }}/micropub?q=source
[source-url]: {{ application.url }}/micropub?q=source&url=WEBSITE_URL
[media-source]: {{ application.url }}/media?q=source

## List query parameters

For list queries `filter`, `limit` and `offset` parameters can be used. For example, `/micropub?q=category&filter=web&limit=10&offset=10`.
