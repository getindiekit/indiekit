# Indiekit

<img src="https://avatars.githubusercontent.com/u/68553280?s=200" width="100" height="100" align="right" alt="">

[![Build status](https://github.com/getindiekit/indiekit/workflows/build/badge.svg)](https://github.com/getindiekit/indiekit/actions)

Meet [Indiekit](https://getindiekit.com), the little Node.js server with all the pieces needed to share your content with the open, independent web.

![Indiekit’s application management interface.](/docs/public/interface-light.png)

## Sponsors

Indiekit is [supported by its community](https://github.com/sponsors/getindiekit). Special thanks to:

<!-- sponsors-readme --><a href="https://github.com/roobottom"><img src="https://github.com/roobottom.png" width="60px" alt="Jon Roobottom" /></a><a href="https://github.com/sentience"><img src="https://github.com/sentience.png" width="60px" alt="Kevin Yank" /></a><a href="https://github.com/abhas"><img src="https://github.com/abhas.png" width="60px" alt="Abhas Abhinav" /></a><!-- sponsors-readme -->

## Features

- **Publish content to your website** using [apps and services](docs/clients.md) that support the [Micropub API](https://micropub.spec.indieweb.org)
- **Save files to a content store** such as GitHub, GitLab or an FTP server
- **Integrate with static site generators** like Jekyll or Hugo
- **Share content** on social networks like Twitter and Mastodon
- **Customise everything** from the interface theme to the format of commit messages

Indiekit is extensible via its [plugin API](docs/plugins/api/index.md) and localized for use in [a growing number of languages](docs/configuration/localisation.md).

## Requirements

- Your own website, published using a static site generator
- [Node.js](https://nodejs.org) v18+

A [MongoDB](https://www.mongodb.com) database is optional, but required for the following features to work:

- Viewing, editing, deleting and restoring previously published posts
- Syndicating posts
- Viewing and deleting previously uploaded media files

> **Note** This project is known to work with MongoDB v4.4 or later. It may also work with the last openly licenced version, v4.0.3, but this has not been tested.

## Get started

Learn how to [set up an Indiekit server](docs/get-started.md) and view an [example server configuration](https://github.com/getindiekit/example-config).

## Documentation website

The documentation website is generated using [VitePress](https://vitepress.vuejs.org). To view this site locally:

1. Install this project’s dependencies: `npm install`
2. Start Jekyll’s server: `npm run docs:dev`
3. View the documentation: <http://127.0.0.1:5173>

The browser will refresh to reflect any changes you make to the documentation.

## Decisions

Architectural decisions made on this project are documented using Architecture Decision Records, as [described by Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions). These can be found in [`/docs/decisions`](docs/decisions).

## Releasing

[Lerna](https://lerna.js.org) is used to manage and publish packages from this monorepo.

To release a new version, use the following command:

```sh
npx lerna publish --conventional-commits
```

## Contributing

Read about the different ways [you can contribute to this project](docs/contributing.md).

## Credits

Developed by [Paul Robert Lloyd](https://paulrobertlloyd.com).

Thank-you to [Aron Carroll](https://aroncarroll.com) for mentoring me during the development of this project. Indiekit is a much better project for his feedback and advice.

## Similar projects

Indiekit is inspired by similar projects made by members of the [IndieWeb community](https://indieweb.org), all of which you are encouraged to try:

- [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) by [Vincent Pickering](https://vincentp.me)
- [Micropub endpoint](https://github.com/muan/micropub-endpoint) by [Mu-An Chiou](https://muan.co)
- [Micropub to GitHub](https://github.com/voxpelli/webpage-micropub-to-github) by [Pelle Wessman](https://kodfabrik.se)
- [Postr](https://github.com/grantcodes/postr) by [Grant Richmond](https://grant.codes)
- [SiteWriter](https://github.com/gerwitz/sitewriter) by [Hans Gerwitz](https://hans.gerwitz.com)
