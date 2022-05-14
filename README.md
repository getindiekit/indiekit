# Indiekit

[![Build status](https://github.com/getindiekit/indiekit/workflows/build/badge.svg)](https://github.com/getindiekit/indiekit/actions)

<img src="https://avatars.githubusercontent.com/u/68553280?s=200" width="100" height="100" align="right" alt="">

[Indiekit](https://getindiekit.com) is a small but powerful server that acts as the go-between your website and the wider independent web.

- Publish content to your website using apps like [iAWriter](https://ia.net/writer), [Micro.blog](https://micro.blog), [Icro](https://hartl.co/apps/icro/), [Indigenous](https://indigenous.realize.be) or services that support the [Micropub API](https://micropub.spec.indieweb.org)

- Syndicate your content to social networks like Twitter and Mastodon, and save posts to the Internet Archive

- ~~Accept likes, comments and other types of feedback on your content with Webmention~~

- Save files to different content stores such as Bitbucket, GitHub, GitLab and Gitea

- Highly configurable, with presets available for common static site generators such as Jekyll and Hugo.

- Localisable, with initial support for English, Dutch, French, German and Portuguese.

## Features

- Create, update and delete posts
- Upload files
- Configure different post types
- Accept post status and visibility
- Review previously published posts and files
- Bookmarklet to save and share bookmarks
- Publish to different [content stores](https://getindiekit.com/plug-ins/#content-stores)
- Support for popular static site generators (Jekyll, Hugo, 11ty)
- Localised to [different languages](https://getindiekit.com/customisation/localisation/)
- ~~Plug-in API~~

## Requirements

- Node.js v16+

## Install

`npm install @indiekit/indiekit`

Learn how to [set up an Indiekit server](https://getindiekit.com/get-started/) and view an [example server configuration](https://github.com/paulrobertlloyd/paulrobertlloyd-indiekit/blob/main/index.js).

## Local development

If you’re developing a new feature, and want the application to automatically restart whenever a file change is detected, use the following command:

```sh
npm run dev
```

The application will run locally using HTTPS. This requires `localhost.pem` and `localhost-key.pem` files in the root folder of the project. These can be [created using the `mkcert` utility](https://web.dev/how-to-use-local-https/).

### Testing

```sh
npm test
```

The following environment variables need to be set before running tests:

- `TEST_TOKEN`
- `TEST_TOKEN_CREATE_SCOPE`
- `TEST_TOKEN_NO_SCOPE`
- `TEST_PUBLICATION_URL`
- `TEST_SESSION_SECRET`

`TEST_TOKEN`, `TEST_TOKEN_CREATE_SCOPE` and `TEST_TOKEN_NO_SCOPE` provide IndieAuth access tokens whose `me` value matches that set in `TEST_PUBLICATION_URL`.`TEST_TOKEN` should provide scope for `create update delete`, `TEST_TOKEN` should provide scope for `create` and `TEST_TOKEN_NO_SCOPE` should provide no scope at all.

[Homebrew Access Token](https://gimme-a-token.5eb.nl) is a useful tool for creating access tokens for this purpose.

## Decisions

Architectural decisions made on this project are documented using Architecture Decision Records, as [described by Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions). These can be found in `/docs/decisions`.

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
