# Endpoint queries

{{ application.name }} supports a number of endpoint queries, both [those in the Micropub standard](https://www.w3.org/TR/micropub/#querying) and others [proposed by the IndieWeb community](https://indieweb.org/Micropub-extensions).

## Micropub endpoint

* Configuration: [`/micropub?q=config`][config]
* Media endpoint location: [`/micropub?q=media-endpoint`][media-endpoint]
* Available syndication targets: [`/micropub?q=syndicate-to`][syndicate-to]
* Supported vocabularies: [`/micropub?q=post-types`][post-types]
* Publication categories: [`/micropub?q=category`][category]
* Previously published posts: [`/micropub?q=source`][source]
* Source content: [`/micropub?q=source&url=WEBSITE_URL`][source-url]

## Media endpoint

* Last uploaded file: [`/media?q=last`][last]

[config]: {{ application.url }}/micropub?q=config
[media-endpoint]: {{ application.url }}/micropub?q=media-endpoint
[syndicate-to]: {{ application.url }}/micropub?q=syndicate-to
[post-types]: {{ application.url }}/micropub?q=post-types
[category]: {{ application.url }}/micropub?q=category
[source]: {{ application.url }}/micropub?q=source
[source-url]: {{ application.url }}/micropub?q=source&url=WEBSITE_URL
[last]: {{ application.url }}/media?q=last
