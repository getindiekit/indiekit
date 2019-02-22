## Getting started

IndieKit is a Node.js application that needs to be hosted on a public server so that it can accept and respond to requests. The easiest way to get started is to deploy this application to Heroku, which can be done by clicking on the button below. This will guide you through the process of getting the application up and running.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/paulrobertlloyd/indiekit)

## Environment variables

If you’d like to deploy this application somewhere else, make sure the following environment variables are set:

* `INDIEKIT_GITHUB_TOKEN`: GitHub access token. **Required**.
* `INDIEKIT_GITHUB_USER`: GitHub username. **Required**.
* `INDIEKIT_GITHUB_REPO`: GitHub repository. **Required**.
* `INDIEKIT_GITHUB_BRANCH`: GitHub branch. Optional, defaults to `master`.
* `INDIEKIT_CONFIG_PATH`: Location of configuration file, relative to repository root. Optional, defaults to `indiekit.json`.
* `INDIEKIT_CACHE_EXPIRES`: Time (in seconds) before cache expires. Optional, defaults to `86400` (1 day).
