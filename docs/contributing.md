# Contributing

Thanks for considering contributing to this project. Indiekit is still in the early stages of development, but you can help this project grow and improve by:

- [proposing a new feature](#proposing-a-new-feature)
- [reporting a bug](#reporting-a-bug)
- [submitting a fix](#submitting-a-fix)
- [improving the documentation](#improving-the-documentation)
- [adding a localisation](#adding-a-localisation)
- [developing a plug-in](#developing-a-plug-in)

This project is intended to be a safe, welcoming space for collaboration with contributors expected to adhere to the project’s [code of conduct](https://github.com/getindiekit/.github/blob/main/CODE_OF_CONDUCT.md).

## Proposing a new feature

The motivation behind Indiekit is to build a tool that makes interacting with [IndieWeb](https://indieweb.org) protocols and technologies accessible, adaptable and approachable. Indiekit also aims to be platform agnostic and built for the long term.

New features should be added with these principles in mind, and improvements that move the project closer to this goal are strongly encouraged.

We use GitHub issues to track feature proposals. Browse [existing proposals](https://github.com/getindiekit/indiekit/issues?q=is%3Aissue+label%3Aenhancement) before adding yours.

## Reporting a bug

We use GitHub issues to track bugs. Browse [existing reports](https://github.com/getindiekit/indiekit/issues?q=is%3Aissue+label%3Abug) before adding yours.

## Submitting a fix

If you spot something that’s broken and can supply a fix, you can [fork the project](https://github.com/getindiekit/indiekit/fork) and create a pull request. See [setting up a local development environment](#setting-up-a-local-development-environment) to get started.

Commit messages for fixes should be prefixed with `fix:`, for example:

`fix: don’t throw error if a user is signed in`

If a fix affects a specific module, include the name of the module in the commit message, for example:

`fix(syndicator-twitter): only post replies to tweets`

## Improving the documentation

Indiekit’s documentation is designed to be accessible and approachable, but it can always be improved.

Documentation can be found in the [`/docs`](https://github.com/getindiekit/indiekit/tree/main/docs) folder and is written using Markdown syntax. You can [contribute changes using GitHub’s interface](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository).

Commit messages for documentation updates should be prefixed with `docs:`, for example:

`docs: fix typo in getting started instructions`

## Adding a localisation

Localisations are managed using Localazy. If you see a translation that is not quite right or would like to add a new language, create an account and [contribute to the project](https://localazy.com/p/indiekit).

## Developing a plug-in

Often the best way to add (or prototype) a new feature is to develop a plug-in using [Indiekit’s plug-in API](plugins/api/index.md).

When publishing a plug-in to the npm registry, add the `indiekit-plugin` tag so that other Indiekit users can find it. You can also request to have it listed alongside [other plug-ins](https://getindiekit.com/plugins/) on the project’s website.

## Setting up a local development environment

### Project structure

This project uses a monorepo structure, with concerns split into separate npm modules located in the `/packages` folder:

| Module | Purpose |
| :----- | :------ |
| `packages/indiekit` | Core module. Provides coordinating functions and the Express web server. |
| `packages/error` | Error handling for the core module and plug-ins. |
| `packages/frontend` | Frontend component library, used for the application interface. |
| `packages/endpoint-*` | Application endpoint plug-ins. |
| `packages/preset-*` | Publication preset plug-ins. |
| `packages/store-*` | Content store plug-ins. |
| `packages/syndicator-*` | Syndicator plug-ins. |

Helper functions used in tests are also split into modules. These are located in the `/helpers` folder.

### Project architecture

Indiekit uses the [Express server framework](https://expressjs.com).

Configuration defaults are merged with any user-defined values (Indiekit uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find and load a configuration object).

Plug-ins listed in the configuration’s `plugin` array are then loaded and interrogated for known API methods, which in turn update the server’s configuration further.

Once the configuration has been fully resolved, these values are passed to the Express server before it can then start.

### Running locally

To run the server locally, first install its dependencies:

```sh
npm install
```

You can then start the server:

```sh
npm start
```

To automatically restart the server whenever a file change is detected, use:

```sh
npm run dev
```

### Tests

[AVA](https://github.com/avajs/ava) is used to run and manage tests, of which both unit and integration types are used.

Tests can be run using the following command:

```sh
npm test
```

To run tests for an individual file, you can call AVA directly using the `npx` command. For example:

```sh
npx ava packages/indiekit/tests/index.js
```

### Test coverage

The project aims to achieve close to 100% test coverage. You can check code coverage by running the following command:

```sh
npm run coverage
```

### Linting

[Prettier](https://prettier.io) is used to maintain consistent and high-quality code. You can check that any changes use the preferred code style by running the following command:

```sh
npm run lint
```
