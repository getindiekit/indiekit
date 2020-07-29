# Indiekit

[![Build status](https://github.com/getindiekit/indiekit/workflows/build/badge.svg)](https://github.com/getindiekit/indiekit/actions)

:warning: **In development, not ready for use**

<img src="https://avatars.githubusercontent.com/u/68553280?s=200" width="100" height="100" align="right" alt="">

Indiekit is a small but powerful server that acts as a go-between your website and the wider independent web. Using IndieWeb protocols and standards, Indiekit lets you:

* publish content to your website using applications like iAWriter, Micro.blog, Icro and Indigenous (and any other tools that supports Micropub)
* ~~accept likes, comments and other feedback on your content (using Webmention)~~
* ~~syndicate content to social networks like Twitter, Mastodon and LinkedIn~~

Indiekit is easy to set up, and can be configured to work with different static site generators (Jekyll, Hugo, 11ty) and hosting software (GitHub and GitLab). Indiekit can be installed on any server that supports Node.js ~~and extended using third-party plugins~~.

## Deploy to Heroku

The easiest way to get started is to deploy this application to Heroku. Clicking the button below will guide you through the process.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/getindiekit/indiekit/tree/main)

## Local development

```sh
npm start
```

If you’re developing a new feature and want the application to automatically restart whenever a file change is detected, you can use `npm run dev`.

### Testing

```sh
npm test
```

The following environment variables need to be set before running tests:

* `TEST_PUBLICATION_URL`
* `TEST_BEARER_TOKEN`
* `TEST_BEARER_TOKEN_NOSCOPE`

`TEST_BEARER_TOKEN` and `TEST_BEARER_TOKEN_NOSCOPE` provide IndieAuth access tokens whose `me` value matches that set in `TEST_PUBLICATION_URL`.`TEST_BEARER_TOKEN` should provide permissions scoped to `create update delete`, whereas `TEST_BEARER_TOKEN_NOSCOPE` should provide no permissions at all.

[Homebrew Access Token](https://gimme-a-token.5eb.nl) is a useful tool for creating access tokens for this purpose.

## Similar projects

Indiekit is inspired by similar projects made by members of the [IndieWeb community](https://indieweb.org), all of which you are encouraged to try:

* [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) by [Vincent Pickering](https://vincentp.me)
* [Micropub endpoint](https://github.com/muan/micropub-endpoint) by [Mu-An Chiou](https://muan.co)
* [Micropub to GitHub](https://github.com/voxpelli/webpage-micropub-to-github) by [Pelle Wessman](https://kodfabrik.se)
* [Postr](https://github.com/grantcodes/postr) by [Grant Richmond](https://grant.codes)
* [SiteWriter](https://github.com/gerwitz/sitewriter) by [Hans Gerwitz](https://hans.gerwitz.com)
