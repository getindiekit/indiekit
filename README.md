# Indiekit

[![Build status](https://github.com/getindiekit/indiekit/workflows/build/badge.svg)](https://github.com/getindiekit/indiekit/actions)

<img src="https://avatars.githubusercontent.com/u/68553280?s=200" width="100" height="100" align="right" alt="">

Meet [Indiekit](https://getindiekit.com), the little Node.js server with all the pieces needed to share your content with the open, independent web

## Features

- **Publish content to your website** using [apps and services](https://getindiekit.com/clients) that support the [Micropub API](https://micropub.spec.indieweb.org)
- **Save files to a content store** such as GitHub, GitLab or an FTP server
- **Integrate with static site generators** like Jekyll or Hugo
- **Share content** on social networks like Twitter and Mastodon

Indiekit is extensible via its [plugin API](https://getindiekit.com/plugins/api/) and localized for use in [a growing number of languages](https://getindiekit.com/configuration/localisation).

## Requirements

- Node.js v18+

A [MongoDB](https://www.mongodb.com) database is optional, but required for many features to work.

## Get started

Learn how to [set up an Indiekit server](https://getindiekit.com/get-started) and view an [example server configuration](https://github.com/getindiekit/example-config).

## Documentation website

The documentation website is generated using [VitePress](https://vitepress.vuejs.org). To view this site locally:

1. Install this project’s dependencies: `npm install`
2. Start Jekyll’s server: `npm run docs:dev`
3. View the documentation: <http://127.0.0.1:5173>

The browser will refresh to reflect any changes you make to the documentation.

## Decisions

Architectural decisions made on this project are documented using Architecture Decision Records, as [described by Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions). These can be found in [`/docs/decisions`](docs/decisions).

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
