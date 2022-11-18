# Indiekit

[![Build status](https://github.com/getindiekit/indiekit/workflows/build/badge.svg)](https://github.com/getindiekit/indiekit/actions)

<img src="https://avatars.githubusercontent.com/u/68553280?s=200" width="100" height="100" align="right" alt="">

[Indiekit](https://getindiekit.com) is a small but powerful server that acts as the go-between your website and the wider independent web.

Publish content to your website using apps like [iAWriter](https://ia.net/writer), [Micro.blog](https://micro.blog), [Icro](https://hartl.co/apps/icro/), [Indigenous](https://indigenous.realize.be) or services that support the [Micropub API](https://micropub.spec.indieweb.org)

## Features

- Create, update and delete posts
- Upload files
- Configure different post types
- Set post status and visibility
- Review previously published posts and files
- Save files to different content stores
- Syndicate content to third-party websites
- Publication presets to support popular static site generators
- Localised to different languages
- [Plug-in API](https://getindiekit.com/plugins/api/)

## Requirements

- Node.js v18+

## Install

Learn how to [set up an Indiekit server](https://getindiekit.com/get-started) and view an [example server configuration](https://github.com/paulrobertlloyd/paulrobertlloyd-indiekit/blob/main/index.js).

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
