# IndieKit

*An IndieWeb publishing toolkit*

* [Introduction](https://paulrobertlloyd.github.io/indiekit/docs/): About this project.
* [Getting started](https://paulrobertlloyd.github.io/indiekit/docs/deploy): Deploying the application.
* [Usage](https://paulrobertlloyd.github.io/indiekit/docs/config): Configuring your website to work with IndieKit.
* [Testing](https://paulrobertlloyd.github.io/indiekit/docs/test): Testing the service locally and running automated tests.
* [Application](https://paulrobertlloyd.github.io/indiekit/docs/app): Documentation of the functions used within the application.

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
* [x] Respond to endpoint `source` queries (all properties)
* [ ] Respond to endpoint `source` queries (select properties)
* [ ] Support Micropub media endpoint
* [x] Support Micropub delete action
* [ ] Support Micropub update (replace) action
* [x] Provide configuration defaults
* [ ] Provide better error handling and logging
* [x] Generate documentation website
* [ ] Add local disk as second publishing destination (and use for testing)
