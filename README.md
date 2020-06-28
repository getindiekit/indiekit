# Indiekit (reimagined)

[![Build status](https://github.com/paulrobertlloyd/indiekit-redux/workflows/build/badge.svg)](https://github.com/paulrobertlloyd/indiekit-redux/actions)

:warning: **In development, not ready for use**

Indiekit is a small but powerful server that acts as your go between your website and the wider independent web. Using IndieWeb protocols and standards, Indiekit lets you:

* publish content to your website using applications like iAWriter, Micro.blog, Icro and Indigenous (and any other tools that supports Micropub)
* ~~accept likes, comments and other feedback on your content (using Webmention)~~
* ~~syndicate your content to social networks like Twitter, Mastodon and LinkedIn~~

Indiekit is easy to set up, and can be configured to work with different static site generators (Jekyll, Hugo, 11ty) and hosting software (GitHub and GitLab). Indiekit can be installed on any server that supports Node.js and extended using third-party plugins.

## Local development

```sh
npm start
```

If you’re developing a new feature and want the application to automatically restart whenever a file change is detected, you can use `npm run dev`.

### Testing

```sh
npm test
```

## Outstanding development

### Previous features that need reimplementing

* [ ] Attach media to Micropub endpoint requests
* [ ] Authenticate Micropub endpoint actions using IndieAuth
* [ ] Authenticate media endpoint actions using IndieAuth
* [ ] Internationalisation
* [ ] Load user configured post type templates
* [ ] Add missing tests

### New features that need finessing

* [ ] Creating/reading/updating post data
* [ ] Architecture for registering and initiating plugins

## Similar projects

Indiekit is inspired by similar projects made by members of the [IndieWeb community](https://indieweb.org), all of which you are encouraged to try:

* [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) by [Vincent Pickering](https://vincentp.me)
* [Micropub endpoint](https://github.com/muan/micropub-endpoint) by [Mu-An Chiou](https://muan.co)
* [Micropub to GitHub](https://github.com/voxpelli/webpage-micropub-to-github) by [Pelle Wessman](https://kodfabrik.se)
* [Postr](https://github.com/grantcodes/postr) by [Grant Richmond](https://grant.codes)
* [SiteWriter](https://github.com/gerwitz/sitewriter) by [Hans Gerwitz](https://hans.gerwitz.com)
