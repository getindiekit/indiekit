# IndieKit

*An IndieWeb publishing toolkit*

## Ambition
The immediate goal of this project is to provide a [Micropub](https://www.w3.org/TR/micropub/) endpoint that can be hosted on a service like Heroku and configured via files stored on a GitHub repo. All aspects of the software will be fully documented and tested, including tests that simulate those provided by the [Micropub Rocks!](https://micropub.rocks) validator.

A longer term ambition is to build a tool that supports more publishing destintions, other social publishing specifications (Webmention, Microsub, ActivityPub etc.) and integrates with a range of content management systems.

## Prior art
* [SiteWriter](https://github.com/gerwitz/sitewriter) by [Hans Gerwitz](https://hans.gerwitz.com)
* [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) by [Vincent Pickering](https://vincentp.me)
* [Micropub endpoint](https://github.com/muan/micropub-endpoint) by [Mu-An Chiou](https://muan.co)
* [Micropub to GitHub](https://github.com/voxpelli/webpage-micropub-to-github) by [Pelle Wessman](https://kodfabrik.se)

## Project status
* [x] Use values stored in a local configuration file
* [x] Respond to endpoint queries (`config`, `syndicate-to`) with endpoint configuration values
* [x] Accept form-encoded and JSON data
* [x] Write content to GitHub repo and return success status code and location of published file.
* [x] Fetch configuration file from remote repo and cache locally
* [x] Fetch template files from remote repo and cache locally
* [x] Expire cache
* [ ] Support Micropub delete action
* [ ] Support Micropub update (replace) action

## Components

### Cache
To prevent making too many calls to any APIs, and to ensure the endpoint isn’t slowed down by making requests to third-parties, should be cache configuration and template files.

### Router
Responds to requests and sends data to relevant application component. Should initially support `GET` and `POST` requests to `/micropub`.

### Micropub
Accept form-encoded and JSON data, convert it to a microformats2 object and process the resulting data so that it can be published to a destination. Provides error, success and query responses, and should support get, create, update and delete actions.

### Microformats
Take a microformats2 object and determine its post type. Based on [post-type-discovery](https://github.com/twozeroone/post-type-discovery) by [Prateek Saxena](prtksxna.com).

### IndieAuth
Use [IndieAuth](https://www.w3.org/TR/indieauth/) to ensure only authenticated users can use endpoint to post to configured destination.

### Formatter
Render a file/string using context data using Nunjucks templating.

### GitHub
Get, create, update and delete data at a specified path at configured GitHub repo.

### Utils
Provides common utility functions.

## Environment variables
This application requires the following environment variables to be set.

* `CONFIG_PATH` Location of configuration file

### GitHub (Required)
* `GITHUB_USER` Username
* `GITHUB_REPO` Repository
* `GITHUB_TOKEN` Access token

### IndieAuth (Required to run tests)
* `TEST_INDIEAUTH_TOKEN` IndieAuth token with `create` and `update` scope. URL *should* match that used in configuration.
* `TEST_INDIEAUTH_TOKEN_NOT_SCOPED` IndieAuth token without a scope. URL *should* match that used in configuration.
* `TEST_INDIEAUTH_TOKEN_NOT_ME` IndieAuth token with `create` and `update` scope. URL *should not* match that used in configuration.
