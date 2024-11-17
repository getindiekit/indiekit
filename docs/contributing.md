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

If you spot something broken and can supply a fix, [fork the project](https://github.com/getindiekit/indiekit/fork) and create a pull request. See [Setting up a local development environment](development.md) to get started.

Commit messages for fixes should be prefixed with `fix:`, for example:

`fix: do not throw error for signed in users`

If a fix affects a specific module, include the name of the module in the commit message, for example:

`fix(endpoint-micropub): only return queried values`

## Improve the documentation

Documentation should be accessible, easy to read and avoid jargon.

Documentation can be found in the [`/docs`](https://github.com/getindiekit/indiekit/tree/main/docs) folder and uses Markdown syntax. You can [use GitHub’s interface to contribute changes](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository).

Commit messages for documentation updates should be prefixed with `docs:`, for example:

`docs: fix typo in getting started instructions`

## Add a localisation

Localazy is used to manage localisations. If you see a translation that is not quite right or would like to add a new language, create an account and [contribute to the project](https://localazy.com/p/indiekit).

## Develop a plug-in

You can use [Indiekit’s plug-in API](api/index.md) to add (or prototype) a new feature.

When publishing a plug-in to the npm registry, add the `indiekit-plugin` keyword to help other Indiekit users find it. To have a plug-in listed [in the plug-in directory](https://getindiekit.com/plugins/), submit a pull request against the relevant page in the documentation.

See also [Setting up a local development environment](development.md).
