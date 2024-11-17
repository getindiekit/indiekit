# Setting up a local development environment

To begin local development on the Indiekit project, clone this repository, configure a [content store](concepts#content-store), [publication preset](concepts#publication-preset) and [syndicator](concepts#syndication), and create a MongoDB database you can connect to.

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

Indiekit uses a MongoDB database for persistence. A convenient way to run MongoDB locally is to use [Docker Compose](https://docs.docker.com/compose/). Since the filesystem of a Docker container is ephemeral, you will need to create a [Docker volume](https://docs.docker.com/storage/volumes/). You can do this with the following docker command:

```sh
docker volume create mongo-data
```

Create a `docker-compose.yml` file that runs a service on an available port of your Docker host (e.g. 27018) and uses the Docker volume you have just created.

```yml
version: '3.9'
services:
  mongo:
    container_name: mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME
      - MONGO_INITDB_ROOT_PASSWORD
    image: mongo:7.0.11
    network_mode: bridge
    ports:
    - '27018:27017'
    restart: always
    volumes:
      - mongo-data:/data/db
volumes:
  mongo-data:
    external: true
```

This configuration tells Docker to run the `mongo` service on port 27017 of the `mongo` container, and expose port 27018 on the Docker host (e.g. your computer).

You can set the necessary environment variables in a `.env` file:

```dotenv
MONGO_INITDB_ROOT_USERNAME="username"
MONGO_INITDB_ROOT_PASSWORD="password"
MONGO_URL="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27018"
```

> [!TIP]
> Alternatively, create a `.envrc` file that can be automatically loaded by [direnv](https://direnv.net/) when you enter the root of the project.

> [!TIP]
> To inspect data stored in a MongoDB database, use the [MongoDB shell](https://www.mongodb.com/products/tools/shell) or an application like [Compass](https://www.mongodb.com/products/tools/compass).

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
