## Endpoint queries

IndieKit supports a number of endpoint queries, both [those in the Micropub standard](https://www.w3.org/TR/micropub/#querying) and others [proposed by the IndieWeb community](https://indieweb.org/Micropub-extensions).

### Micropub endpoint

* Configuration (`/micropub?q=config`)
* Media endpoint location (`/micropub?q=media-endpoint`)
* Available syndication targets (`/micropub?q=syndicate-to`)
* Supported vocabularies (`/micropub?q=post-types`)
* Publication categories (`/micropub?q=category`)
* Previously published posts (`/micropub?q=source`)
* Source content (`/micropub?q=source&url=[url]`)

### Media endpoint

* Last uploaded file (`/media?q=last`)
