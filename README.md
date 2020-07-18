# Indiekit (reimagined)

[![Build status](https://github.com/paulrobertlloyd/indiekit-redux/workflows/build/badge.svg)](https://github.com/paulrobertlloyd/indiekit-redux/actions)

:warning: **In development, not ready for use**

Indiekit is a small but powerful server that acts as your go between your website and the wider independent web. Using IndieWeb protocols and standards, Indiekit lets you:

* publish content to your website using applications like iAWriter, Micro.blog, Icro and Indigenous (and any other tools that supports Micropub)
* ~~accept likes, comments and other feedback on your content (using Webmention)~~
* ~~syndicate your content to social networks like Twitter, Mastodon and LinkedIn~~

Indiekit is easy to set up, and can be configured to work with different static site generators (Jekyll, Hugo, 11ty) and hosting software (GitHub and GitLab). Indiekit can be installed on any server that supports Node.js and extended using third-party plugins.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/paulrobertlloyd/indiekit-redux/tree/main)

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

* [x] Attach media to Micropub endpoint requests
* [x] Update media properties (`audio`, `photo`, `video`)
* [x] Authenticate Micropub endpoint actions using IndieAuth
* [x] Check scopes for Micropub endpoint actions
* [x] Creating/reading/updating post data
* [x] Use user configured post types
* [ ] Load user configured post type templates
* [ ] Internationalisation
* [ ] Architecture for registering and initiating plugins
* [ ] Add missing tests

## Similar projects

Indiekit is inspired by similar projects made by members of the [IndieWeb community](https://indieweb.org), all of which you are encouraged to try:

* [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) by [Vincent Pickering](https://vincentp.me)
* [Micropub endpoint](https://github.com/muan/micropub-endpoint) by [Mu-An Chiou](https://muan.co)
* [Micropub to GitHub](https://github.com/voxpelli/webpage-micropub-to-github) by [Pelle Wessman](https://kodfabrik.se)
* [Postr](https://github.com/grantcodes/postr) by [Grant Richmond](https://grant.codes)
* [SiteWriter](https://github.com/gerwitz/sitewriter) by [Hans Gerwitz](https://hans.gerwitz.com)
