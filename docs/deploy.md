## Getting started

IndieKit is a Node.js application that needs to be hosted on a public server so that it can accept and respond to requests. The easiest way to get started is to deploy this application to Heroku, which can be done by clicking on the button below. This will guide you through the process of getting the application up and running.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/paulrobertlloyd/indiekit)

To enable automatic discovery of your Micropub (and token) endpoints, ensure the following values are included in your site’s `<head>`, providing the URL of your deployed application for the `micropub` value:

```html
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
<link rel="micropub" href="https://<your-endpoint>/micropub">
```

## Environment variables

If you’d like to deploy this application somewhere else, make sure the following environment variables are set, taking note of those that are required:

### IndieKit
* `INDIEKIT_URL`: URL of the website you want to publish to. **Required**.
* `INDIEKIT_CONFIG_PATH`: Location of configuration file, relative to repository root. *Optional*, if not provided, default values will be used for templates and file paths.
* `INDIEKIT_CACHE_EXPIRES`: Time (in seconds) before cache expires. *Optional*, defaults to `86400` (1 day).
* `INDIEKIT_LOCALE`: Local with which to format dates. *Optional*, defaults to `en-GB`.

### IndieAuth
* `INDIEAUTH_TOKEN_ENDPOINT`: IndieAuth token endpoint. *Optional*, defaults [`https://tokens.indieauth.com/token`](https://tokens.indieauth.com/token)

### GitHub
* `GITHUB_TOKEN`: GitHub access token. **Required**.
* `GITHUB_USER`: GitHub username. **Required**.
* `GITHUB_REPO`: GitHub repository. **Required**.
* `GITHUB_BRANCH`: GitHub branch files are to. *Optional*, defaults to `master`.

### Timber
If you want to send logs to [Timber](https://timber.io), set the following variables:

* `TIMBER_TOKEN`: Timber API key. *Optional*
* `TIMBER_SOURCE`: Timber source ID. *Optional*
