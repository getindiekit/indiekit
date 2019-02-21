## Getting started

IndieKit is a Node.js application, that needs to be hosted on a public server so that it can accept and respond to requests. The easiest way to get started is to deploy to Heroku, which can be done by clicking the button below. This will guide you trough the process of getting the application up and running.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Environment variables

If you plan on deploying this application somewhere else, be aware that the following environment variables to be set:

* `INDIEKIT_CONFIG_PATH`: Location of configuration file, relative to repository root. Optional, defaults to `indiekit.json`.
* `INDIEKIT_GITHUB_TOKEN`: GitHub access token. **Required**.
* `INDIEKIT_GITHUB_USER`: GitHub username. **Required**.
* `INDIEKIT_GITHUB_REPO`: GitHub repository. **Required**.
* `INDIEKIT_GITHUB_BRANCH`: GitHub branch. Optional, defaults to `master`.
