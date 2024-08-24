# Setting up a local development environment

## Project structure

This project uses a monorepo structure, with concerns split into separate Node modules located in the `/packages` folder:

| Module{width=200px} | Purpose |
| :----- | :------ |
| `indiekit` | Coordinating functions and the Express web server. |
| `frontend` | Frontend component library, used for the application interface. |
| `error` | Error handling for the core module and plug-ins. |
| `create-indiekit` | Project initialiser, used when running `npm create indiekit`. |
| `endpoint-*` | Application endpoint plug-ins. |
| `post-type-*` | Post type plug-ins. |
| `preset-*` | Publication preset plug-ins. |
| `store-*` | Content store plug-ins. |
| `syndicator-*` | Syndicator plug-ins. |

Helper functions used in tests are in the `/helpers` folder.

## Project architecture

Indiekit uses the [Express server framework](https://expressjs.com).

Configuration defaults get merged with any user-defined values (Indiekit uses [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) to find and load a configuration object).

Plug-ins listed under the `plugins` array are then loaded and interrogated for known API methods, which further update the configuration.

Express waits for a resolved configuration file before starting the server.

## Running locally

To run the server locally, first install its dependencies:

```sh
npm install
```

The provided configuration file allows some options to be assigned using environment variables.

Create an `.env` file in the root of the project, for example:

```sh
# Required
PUBLICATION_URL="https://example.com"

# Database connection string URI (optional)
MONGO_URL="mongodb://127.0.0.1:27017"

# Test saving files to a content store on GitHub (optional)
GITHUB_USER="username"
GITHUB_REPO="indiekit-test"
GITHUB_BRANCH="main"
GITHUB_TOKEN="12345abcde"

# Test syndicating content to a Mastodon server (optional)
MASTODON_URL="https://example.social"
MASTODON_USER="indiekit-test"
MASTODON_ACCESS_TOKEN="12345abcde"
```

You can then start the server:

```sh
npm start
```

To automatically restart the server whenever a file change is detected, use:

```sh
npm run dev
```

To enable authentication, use the `production` flag:

```sh
npm run dev --production
```

## Tests

The project uses both unit and integration tests. Run tests using the following command:

```sh
npm test
```

To run an individual test, use `node` followed by the path to the test. For example:

```sh
node packages/indiekit/test/index.js
```

## Test coverage

The project aims to achieve close to 100% test coverage. You can check code coverage by running the following command:

```sh
npm run test:coverage
```

## Linting

Consistent and high-quality code is maintained using [Prettier](https://prettier.io) with [ESLint](https://eslint.org) used to check JavaScript files and [Stylelint](https://stylelint.io) used to check CSS stylesheets.

You can check that any changes use the preferred code style by running the following command:

```sh
npm run lint
```

You automatically fix any issues by running the following command:

```sh
npm run lint:fix
```
