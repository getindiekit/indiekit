## Getting started

IndieKit is a Node.js application that needs to be hosted on a public server so that it can accept and respond to requests. The easiest way to get started is to deploy this application to Heroku, which can be done by clicking on the button below. This will guide you through the process of getting the application up and running.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/paulrobertlloyd/indiekit)

## Environment variables

If you’d like to deploy this application somewhere else, make sure the following environment variables are set:

* `GITHUB_TOKEN`: GitHub access token. **Required**.
* `GITHUB_USER`: GitHub username. **Required**.
* `GITHUB_REPO`: GitHub repository. **Required**.
* `GITHUB_BRANCH`: GitHub branch. Optional, defaults to `master`.
* `INDIEAUTH_TOKEN_ENDPOINT`: IndieAuth token endpoint. Optional, defaults [`https://tokens.indieauth.com/token`](https://tokens.indieauth.com/token)
* `INDIEKIT_CONFIG_PATH`: Location of configuration file, relative to repository root. Optional, defaults to `indiekit.json`.
* `INDIEKIT_CACHE_EXPIRES`: Time (in seconds) before cache expires. Optional, defaults to `86400` (1 day).
