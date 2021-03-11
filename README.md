# Indiekit

[![Build status](https://github.com/getindiekit/indiekit/workflows/build/badge.svg)](https://github.com/getindiekit/indiekit/actions)

<img src="https://avatars.githubusercontent.com/u/68553280?s=200" width="100" height="100" align="right" alt="">

[Indiekit](https://getindiekit.com) is a small but powerful server that acts as the go-between your website and the wider independent web.

* Publish content to your website using apps like [iAWriter](https://ia.net/writer), [Micro.blog](https://micro.blog), [Icro](https://hartl.co/apps/icro/), [Indigenous](https://indigenous.realize.be) or services that support the [Micropub API](https://micropub.spec.indieweb.org)

* Syndicate your content to social networks like Twitter, ~~Mastodon and LinkedIn~~, and save posts to the Internet Archive

* ~~Accept likes, comments and other types of feedback on your content with Webmention~~

* Save files to different content stores such as Bitbucket, GitHub, GitLab and Gitea

* Highly configurable, with presets available for common static site generators such as Jekyll and Hugo.

* Localisable, with initial support for English, French and German.

## Features

* Create, update and delete posts
* Upload files
* Configure different post types
* Accept post status and visibility
* Review previously published posts and files
* Bookmarklet to save and share bookmarks
* Publish to different [content stores](https://getindiekit.com/plug-ins/#content-stores)
* Support for popular static site generators (Jekyll, Hugo, 11ty)
* Localised to [different languages](https://getindiekit.com/docs/localisation/)
* ~~Plug-in API~~

## Requirements

* Node.js v14+

## Install

`npm install @indiekit/indiekit`

Learn how to [set up an Indiekit server](https://getindiekit.com/docs/getting-started/) and view an [example server configuration](https://github.com/paulrobertlloyd/paulrobertlloyd-indiekit/blob/main/index.js).

## Demo

If you want to see how Indiekit works, deploy this application to Heroku.

> This assumes you’ll be saving files to GitHub and publishing to a Jekyll (or similar) static site generator.

Clicking the button below will guide you through the process.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/getindiekit/indiekit/tree/main)

You’ll be asked to provide the following values:

* `GITHUB_TOKEN` - A GitHub [personal access token](https://github.com/settings/tokens)
* `GITHUB_USER` - Your username on GitHub
* `GITHUB_REPO` - Name of the repository where you want to save files
* `PUBLICATION_URL` - URL of the website you want to publish to

## Local development

```sh
npm start
```

If you’re developing a new feature, and want the application to automatically restart whenever a file change is detected, use `npm run dev`.

### Testing

```sh
npm test
```

The following environment variables need to be set before running tests:

* `TEST_PUBLICATION_URL`
* `TEST_BEARER_TOKEN`
* `TEST_BEARER_TOKEN_NOSCOPE`

`TEST_BEARER_TOKEN` and `TEST_BEARER_TOKEN_NOSCOPE` provide IndieAuth access tokens whose `me` value matches that set in `TEST_PUBLICATION_URL`.`TEST_BEARER_TOKEN` should provide scoped permissions `create update delete`, whereas `TEST_BEARER_TOKEN_NOSCOPE` should provide no permissions at all.

[Homebrew Access Token](https://gimme-a-token.5eb.nl) is a useful tool for creating access tokens for this purpose.

## Decisions

Architectural decisions made on this project are documented using Architecture Decision Records, as [described by Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions). These can be found in `/docs/decisions`.

Nat Pryce's [adr-tools](https://github.com/npryce/adr-tools) is a lightweight command line tools for managing documents.

To generate a new decision document:

```sh
adr new [Title of decision]
```

To update the table of contents:

```sh
adr generate toc > docs/decisions/index.md
```

## Credits

Developed by [Paul Robert Lloyd](https://paulrobertlloyd.com).

Thank-you to [Aron Carroll](https://aroncarroll.com) for mentoring me during the development of this project. Indiekit is a much better project for his feedback and advice.

## Similar projects

Indiekit is inspired by similar projects made by members of the [IndieWeb community](https://indieweb.org), all of which you are encouraged to try:

* [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) by [Vincent Pickering](https://vincentp.me)
* [Micropub endpoint](https://github.com/muan/micropub-endpoint) by [Mu-An Chiou](https://muan.co)
* [Micropub to GitHub](https://github.com/voxpelli/webpage-micropub-to-github) by [Pelle Wessman](https://kodfabrik.se)
* [Postr](https://github.com/grantcodes/postr) by [Grant Richmond](https://grant.codes)
* [SiteWriter](https://github.com/gerwitz/sitewriter) by [Hans Gerwitz](https://hans.gerwitz.com)
