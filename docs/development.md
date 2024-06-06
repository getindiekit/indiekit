# Setting up a local development environment

For developing Indiekit, you will need to clone this repository, configure all the [content stores](concepts#content-store), [publication presets](concepts#publication-preset) and [syndicators](concepts#syndication) you want to use, and have a MongoDB database that you can connect to.

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

Indiekit uses a MongoDB database for persistence. A convenient way to run MongoDB locally is to use [Docker Compose](https://docs.docker.com/compose/). Since the filesystem of a Docker container is ephemeral, you will need to create a [Docker volume](https://docs.docker.com/storage/volumes/) first.

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

This particular configuration tells Docker to run the `mongo` service on port 27017 of the `mongo` container, and exposes port 27018 on the Docker host (e.g. your laptop).

You can set the necessary environment variables in a `.env` file, or use an `.envrc` file that will be automatically loaded by [direnv](https://direnv.net/) when
you enter the root of the project.

```txt
export MONGO_INITDB_ROOT_USERNAME="user"
export MONGO_INITDB_ROOT_PASSWORD="password"
export MONGO_URL="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27018"

```

> [!TIP]
> If you want to inspect data stored in a MongoDB database, you can use the [MongoDB shell](https://www.mongodb.com/products/tools/shell) or a GUI like [Compass](https://www.mongodb.com/products/tools/compass).

## Configure the content store

Indiekit performs CRUD operations on files. These files needs to be stored in a so-called content store. Different content stores require different configurations and credentials.

### GitHub content store

If you want to use a GitHub repository as your content store, you will need to provide a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens). If you create a [fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#fine-grained-personal-access-tokens), give it **Read and write** access to **Contents**, and set a reasonable expiration (e.g. 90 days).

```txt
export GITHUB_USER="johndoe"
export GITHUB_REPO="indiekit-content"
export GITHUB_BRANCH="main"
export GITHUB_TOKEN="github_pat_*****"
```

## Configure the syndicators

In order to tell Indiekit to [share content with other third-party websites](introduction#sharing-content-with-third-party-websites-syndication), you need to configure one or more syndicators.

## Mastodon syndicator

If you want to syndicate your content to Mastodon, you will need to provide a Mastodon access token with **read and write** access. You can generate an access token using [this web app](https://takahashim.github.io/mastodon-access-token/), or making a POST request as explained [on this page of the Mastodon documentation](https://docs.joinmastodon.org/client/token/).

> [!WARNING]
> As far as I know, [Mastodon access tokens do not expire](https://mastodon.social/@kevinhooke/109377838604407902).

```txt
export MASTODON_ACCESS_TOKEN="*****"
export MASTODON_USER="johndoe"
export MASTODON_URL="https://fosstodon.org"
```

## Running Indiekit locally

### Installation

Install all dependencies:

```sh
npm install
```

### Environment variables

Update your `.env` / `.envrc` file with the environment variables required by the Indiekit server, the MongoDB database, the Indiekit content store and the Indiekit syndicators.

```txt
export PUBLICATION_URL="https://example.com"

# Used by @indiekit/endpoint-auth to sign and verify tokens and salt password
export SECRET="*****"

# Hashed and salted password used when signing in. You can generate this value by visiting /auth/new-password
export PASSWORD_SECRET="="*****"

# Environment variables for MongoDB
# Environment variables for Indiekit content store (e.g. GitHub)
# Environment variables for Indiekit syndicators (e.g. Mastodon)
```

### Run Indiekit

Start the server:

```sh
npm start
```

In alternative, automatically restart the server whenever a file change is detected:

```sh
npm run dev
```

To enable authentication, use the `production` flag:

```sh
npm run dev --production
```

### Tests

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

### Linting

Consistent and high-quality code is maintained using [Prettier](https://prettier.io) with [ESLint](https://eslint.org) used to check JavaScript files and [Stylelint](https://stylelint.io) used to check CSS stylesheets.

You can check that any changes use the preferred code style by running the following command:

```sh
npm run lint
```

You automatically fix any issues by running the following command:

```sh
npm run lint:fix
```
