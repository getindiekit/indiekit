# Contributing

Thanks for considering contributing to this project. There are a number of way you can help this project grow and improve:

- [tell a friend](#tell-a-friend)
- [propose a feature](#propose-a-feature)
- [report a bug](#report-a-bug)
- [submit a fix](#submit-a-fix)
- [improve the documentation](#improve-the-documentation)
- [add a localisation](#add-a-localisation)
- [develop a plug-in](#develop-a-plug-in)

For this project to be a safe, welcoming space for collaboration, contributors must adhere to our [code of conduct](https://github.com/getindiekit/.github/blob/main/CODE_OF_CONDUCT.md).

## Tell a friend

One of the best (and easiest) ways to grow this project is to tell people about it!

If you are using Indiekit, add yourself to the [list of people using Indiekit on the IndieWeb wiki](https://indieweb.org/Indiekit#People_using_it).

## Propose a feature

The motivation behind Indiekit is to build a tool that makes interacting with [IndieWeb](https://indieweb.org) protocols and technologies accessible, adaptable and approachable. Indiekit also aims to be platform agnostic and built for the long term.

Features and improvements that move the project closer to these goals are strongly encouraged.

We use GitHub issues to track feature requests. Browse [existing proposals](https://github.com/getindiekit/indiekit/issues?q=is%3Aissue+label%3Aenhancement) before adding yours.

## Report a bug

We use GitHub issues to track bugs. Browse [existing reports](https://github.com/getindiekit/indiekit/issues?q=is%3Aissue+label%3Abug) before adding yours.

## Submit a fix

If you spot something broken and can supply a fix, [fork the project](https://github.com/getindiekit/indiekit/fork) and create a pull request. See [setting up a local development environment](#setting-up-a-local-development-environment) to get started.

Commit messages for fixes should be prefixed with `fix:`, for example:

`fix: do not throw error for signed in users`

If a fix affects a specific module, include the name of the module in the commit message, for example:

`fix(syndicator-twitter): only post replies to tweets`

## Improve the documentation

Documentation should be accessible, easy to read and avoid jargon.

Documentation can be found in the [`/docs`](https://github.com/getindiekit/indiekit/tree/main/docs) folder and uses Markdown syntax. You can [use GitHub’s interface to contribute changes](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository).

Commit messages for documentation updates should be prefixed with `docs:`, for example:

`docs: fix typo in getting started instructions`

## Add a localisation

Localazy is used to manage localisations. If you see a translation that is not quite right or would like to add a new language, create an account and [contribute to the project](https://localazy.com/p/indiekit).

## Develop a plug-in

You can use [Indiekit’s plug-in API](plugins/api/index.md) to add (or prototype) a new feature.

When publishing a plug-in to the npm registry, add the `indiekit-plugin` keyword to help other Indiekit users find it. To have a plug-in listed [in the plug-in directory](https://getindiekit.com/plugins/), submit a pull request against the relevant page in the documentation.

## Setting up a local development environment

### Project structure

This project uses a monorepo structure, with concerns split into separate Node modules located in the `/packages` folder:

| Module{width=200px} | Purpose |
| :----- | :------ |
| `indiekit` | Core module. Provides coordinating functions and the Express web server. |
| `frontend` | Frontend component library, used for the application interface. |
| `error` | Error handling for the core module and plug-ins. |
| `create-indiekit` | Project initialiser, used when running `npm create indiekit`. |
| `endpoint-*` | Application endpoint plug-ins. |
| `preset-*` | Publication preset plug-ins. |
| `store-*` | Content store plug-ins. |
| `syndicator-*` | Syndicator plug-ins. |

Helper functions used in tests are in the `/helpers` folder.

### Project architecture

Indiekit uses the [Express server framework](https://expressjs.com).

Configuration defaults get merged with any user-defined values (Indiekit uses [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) to find and load a configuration object).

Plug-ins listed under the `plugins` array are then loaded and interrogated for known API methods, which further update the configuration.

Express waits for a resolved configuration file before starting the server.

### Running locally

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

# Test syndicating content to Twitter (optional)
TWITTER_USER="indiekit-test"
TWITTER_ACCESS_TOKEN="12345abcde"
TWITTER_ACCESS_TOKEN_SECRET="12345abcde"
TWITTER_API_KEY="12345abcde"
TWITTER_API_KEY_SECRET="12345abcde"
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

### Tests

[AVA](https://github.com/avajs/ava) is used to run and manage tests. The project uses both unit and integration tests.

Run tests using the following command:

```sh
npm test
```

Call AVA directly using the `npx` command to run tests for an individual file. For example:

```sh
npx ava packages/indiekit/tests/index.js
```

### Test coverage

The project aims to achieve close to 100% test coverage. You can check code coverage by running the following command:

```sh
npm run coverage
```

### Linting

Consistent and high-quality code is maintained using [Prettier](https://prettier.io). You can check that any changes use the preferred code style by running the following command:

```sh
npm run lint
```
