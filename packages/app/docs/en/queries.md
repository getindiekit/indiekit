# Endpoint queries

{{ app.name }} supports a number of endpoint queries, both [those in the Micropub standard](https://www.w3.org/TR/micropub/#querying) and others [proposed by the IndieWeb community](https://indieweb.org/Micropub-extensions).

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

[config]: {{ app.url }}/micropub?q=config
[media-endpoint]: {{ app.url }}/micropub?q=media-endpoint
[syndicate-to]: {{ app.url }}/micropub?q=syndicate-to
[post-types]: {{ app.url }}/micropub?q=post-types
[category]: {{ app.url }}/micropub?q=category
[source]: {{ app.url }}/micropub?q=source
[source-url]: {{ app.url }}/micropub?q=source&url=WEBSITE_URL
[last]: {{ app.url }}/media?q=last
