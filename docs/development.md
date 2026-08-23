# Setting up a local development environment

To begin local development on the Indiekit project, clone this repository, run `npm install`, then copy `.env.example` to `.env`. To run the server you will also want a [content store](concepts#content-store), [publication preset](concepts#publication-preset) and [syndicator](concepts#syndication), and a MongoDB database to connect to.

Running the tests needs none of that — see [Tests](#tests).

## Project structure

The Indiekit project uses a monorepo structure, with concerns split into separate npm packages located in the `/packages` folder:

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

## MongoDB

Indiekit uses a MongoDB database for persistence. The repository ships a
`compose.yaml` that runs one, so you do not need to install MongoDB locally:

```sh
npm run db:up
```

This starts MongoDB on port 27018 of your host, storing its data in a named
Docker volume so it survives a restart. Use `npm run db:down` to stop it, or
`npm run db:reset` to stop it and discard the data.

The port defaults to 27018 rather than 27017 so that it does not collide with
a MongoDB already installed on your machine. Set `MONGO_PORT` to change it.

Copy `.env.example` to `.env` to get a matching `MONGO_URL`:

```dotenv
MONGO_INITDB_ROOT_USERNAME="indiekit"
MONGO_INITDB_ROOT_PASSWORD="indiekit"
MONGO_URL="mongodb://indiekit:indiekit@localhost:27018"
```

> [!TIP]
> Alternatively, create a `.envrc` file that can be automatically loaded by [direnv](https://direnv.net/) when you enter the root of the project.

> [!TIP]
> To inspect data stored in a MongoDB database, use the [MongoDB shell](https://www.mongodb.com/products/tools/shell) or an application like [Compass](https://www.mongodb.com/products/tools/compass).

> [!NOTE]
> MongoDB is optional. Leave `MONGO_URL` unset to run Indiekit without persistence; see the [README](https://github.com/getindiekit/indiekit#readme) for which features need a database.

## Configure a content store

Indiekit performs create, read, update and delete (CRUD) operations on files that are stored in a content store. Different content stores require different configurations and credentials.

### GitHub

To use a GitHub repository as a content store, first create a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

If creating a [fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#fine-grained-personal-access-tokens), ensure that permissions for your repository include **Read** access to **Metadata** and **Read and write** access to **Contents**. You should also set a reasonable expiration (e.g. 90 days).

Add the following details to your `.env` file:

```dotenv
GITHUB_USER="username" # Your GitHub username
GITHUB_REPO="repo" # The name of your repository
GITHUB_BRANCH="main"
GITHUB_TOKEN="github_pat_*****"
```

## Configure a syndicator

To [share content with other third-party websites](introduction#sharing-content-with-third-party-websites-syndication), configure one or more syndicators.

### Mastodon syndicator

To syndicate content to a Mastodon account, create a Mastodon access token with **read and write** access. You can generate an access token using [this web app](https://takahashim.github.io/mastodon-access-token/), or by [making a `POST` request](https://docs.joinmastodon.org/client/token/) to your chosen Mastodon server.

> [!WARNING]
> Mastodon access tokens do not expire.

Add the following details to your `.env` file:

```dotenv
MASTODON_ACCESS_TOKEN="*****"
MASTODON_USER="username"
MASTODON_URL="https://mastodon.social"
```

## Running Indiekit locally

### Installation

Install all dependencies:

```sh
npm install
```

### Environment variables

Update your `.env` file with the environment variables required by the Indiekit server, the MongoDB database, the Indiekit content store and the Indiekit syndicators.

```dotenv
PUBLICATION_URL="https://website.example"

# Used by @indiekit/endpoint-auth to sign and verify tokens and salt password
SECRET="*****"

# Hashed and salted password used when signing in.
# Generate this value by visiting /auth/new-password
PASSWORD_SECRET="*****"

# Environment variables for MongoDB
# Environment variables for your content store (e.g. GitHub)
# Environment variables for any syndicators (e.g. Mastodon)
```

### Run Indiekit

Start the server:

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

The test suite needs no setup at all: it starts its own in-memory MongoDB, so
no database has to be running, and the `test` script supplies development
defaults for `NODE_ENV`, `SECRET` and `PASSWORD_SECRET`. A clean checkout can
run `npm install && npm test` straight away. Setting `SECRET` or
`PASSWORD_SECRET` in the environment overrides the default.

To run a single test suite, use `node` followed by the path to the test. For example:

```sh
node packages/indiekit/test/index.js
```

### Test coverage

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
