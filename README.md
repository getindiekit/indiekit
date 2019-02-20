*An IndieWeb publishing toolkit*

The immediate goal of this project is to provide a [Micropub](https://www.w3.org/TR/micropub/) endpoint that can be hosted on a service like Heroku and configured via files stored on a GitHub repo. All aspects of the software will be [fully documented](https://paulrobertlloyd.github.io/indiekit/docs) and tested, including tests that simulate those provided by the [Micropub Rocks!](https://micropub.rocks) validator.

A longer term ambition is to build a tool that supports more publishing destintions, other social publishing specifications (Webmention, Microsub, ActivityPub etc.) and integrates with a range of content management systems.

## Prior art
* [SiteWriter](https://github.com/gerwitz/sitewriter) by [Hans Gerwitz](https://hans.gerwitz.com)
* [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) by [Vincent Pickering](https://vincentp.me)
* [Micropub endpoint](https://github.com/muan/micropub-endpoint) by [Mu-An Chiou](https://muan.co)
* [Micropub to GitHub](https://github.com/voxpelli/webpage-micropub-to-github) by [Pelle Wessman](https://kodfabrik.se)

## Project status
* [x] Respond to endpoint `config` and `syndicate-to` queries with values stored in a local configuration file
* [x] Accept form-encoded and JSON requests
* [x] Post to GitHub and return success status code and location of published file.
* [x] Fetch configuration file from remote repo and cache locally
* [x] Fetch template files from remote repo and cache locally
* [x] Expire cache
* [x] Support variations of mf2 `photo` property (with/without objects in array)
* [x] Support variations of mf2 `content` property (with/without `html` value)
* [ ] Accept multipart encoded requests
* [ ] Respond to endpoint `source` queries
* [ ] Support Micropub media endpoint
* [x] Support Micropub delete action
* [ ] Support Micropub update (replace) action
* [ ] Provide default templates for different post types
* [ ] Provide better error handling and logging
* [x] Generate documentation website
* [ ] Add local disk as second publishing destination (and use for testing)

## Environment variables
This application requires the following environment variables to be set.

* `CONFIG_PATH` Location of configuration file

### GitHub (Required)
* `GITHUB_USER` Username
* `GITHUB_REPO` Repository
* `GITHUB_TOKEN` Access token

### IndieAuth (Required to run tests)
* `TEST_INDIEAUTH_TOKEN` IndieAuth token with `create`, `update` and `delete` scopes. URL *should* match that used in configuration.
* `TEST_INDIEAUTH_TOKEN_NOT_SCOPED` IndieAuth token without a scope. URL *should* match that used in configuration.
* `TEST_INDIEAUTH_TOKEN_NOT_ME` IndieAuth token with `create` and `update` scopes. URL *should not* match that used in configuration.

You can use [Homebrew Access Token](https://gimme-a-token.5eb.nl) to create tokens for testing locally.

## Credits
Favicon adapted from [‘to merge’](https://www.toicon.com/icons/afiado_merge) icon by Susana Passinhas.
