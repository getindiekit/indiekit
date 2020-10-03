# Indiekit

[![Build status](https://github.com/getindiekit/indiekit/workflows/build/badge.svg)](https://github.com/getindiekit/indiekit/actions)

<img src="https://avatars.githubusercontent.com/u/68553280?s=200" width="100" height="100" align="right" alt="">

Indiekit is a small but powerful server that acts as the go-between your website and the wider independent web. Using IndieWeb protocols and standards, Indiekit lets you:

* publish content to your website using applications like [iAWriter](https://ia.net/writer), [Micro.blog](https://micro.blog), [Icro](https://hartl.co/apps/icro/), [Indigenous](https://indigenous.realize.be) and other tools that support the [Micropub API](https://micropub.spec.indieweb.org)
* ~~accept likes, comments and other feedback on your content using Webmentions~~
* ~~syndicate content to social networks like Twitter, Mastodon and LinkedIn~~

## Quick start

The easiest way to get started is to deploy this application to Heroku.

> This assumes you’ll be saving files to GitHub and publishing to a Jekyll (or similar) static site generator.

Clicking the button below will guide you through the process.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/getindiekit/indiekit/tree/main)

You’ll be asked to provide the following values:

* `GITHUB_TOKEN` - A GitHub [personal access token](https://github.com/settings/tokens)
* `GITHUB_USER` - Your username on GitHub
* `GITHUB_REPO` - Name of the repository where you want to save files
* `PUBLICATION_URL` - URL of the website you want to publish to

* * *

## Contents

* [Requirements](#requirements)
* [Features](#features)
* [Usage](#usage)
* [Options](#options)
* [Local development](#local-development)
* [Credits](#credits)
* [Similar projects](#similar-projects)

## Requirements

* Node.js v12+

## Features

* Create, update and delete posts
* Upload files
* Configure different post types
* Accept post status and visibility
* Review previously published posts and files
* Bookmarklet to save and share bookmarks
* Publish to different content stores (GitHub and GitLab)
* Support for popular static site generators (Jekyll, Hugo, 11ty)
* Localised to [different languages](/docs/localisation.md)
* ~~Plug-in API~~

## Install

`npm install @indiekit/indiekit`

## Usage

### Set up your server

Create a configuration file, `indiekit.config.js`, setup Indiekit and export its server:

```js
import {Indiekit} from '@indiekit/indiekit';

// Create a new indiekit instance
const indiekit = new Indiekit();

// Create a server
const server = indiekit.server();

// Export server
export default server;
```

Start the server with `node indiekit.config.js`.

Indiekit can now listen for Micropub requests, but a few bits of information are needed before it can publish content to your website.

### Configure your publication

Indiekit needs to know your website’s URL. You can provide this information using Indiekit’s configuration API, like so:

```js
indiekit.set('publication.me', 'https://paulrobertlloyd.com');
```

### Add a publication preset

Indiekit needs to know what post types you want to publish (for example notes and photos) and in which format. This information can be provided by setting `publication.postTypes` and `publication.postTemplate`. See [Configuring post types](/docs/post-types.md) and [Creating a post template](/docs/post-template.md).

A publication preset plug-in can provide default values for these options (which you can override in your configuration file).

If you use the Jekyll static site generator, you can install the [Jekyll plug-in](https://www.npmjs.com/package/@indiekit/preset-jekyll):

`npm install @indiekit/preset-jekyll`

Then add it to your configuration file:

```js
import {JekyllPreset} from '@indiekit/preset-jekyll';
const jekyll = new JekyllPreset();
indiekit.set('publication.preset', jekyll);
```

### Add a content store

Indiekit needs to know where to store your posts and media files. A content store plug-in provides this functionality.

If you are saving your files to GitHub, install the GitHub plug-in:

`npm install @indiekit/store-github`

Then add it to your configuration file:

```js
import {GithubStore} from '@indiekit/store-github';
const github = new GithubStore({
  user: 'username', // Your username on GitHub
  repo: 'reponame', // Repository files will be saved to
  branch: 'main', // Branch to publish to
  token: 'token' // GitHub personal access token
});
indiekit.set('publication.store', github);
```

### Example configuration

With all these settings in place, your configuration file will look something like this:

```js
import {Indiekit} from '@indiekit/indiekit';
import {JekyllPreset} from '@indiekit/preset-jekyll';
import {GithubStore} from '@indiekit/store-github';

// Create a new indiekit instance
const indiekit = new Indiekit();

// Configure GitHub content store
const github = new GithubStore({
  user: 'username', // Your username on GitHub
  repo: 'reponame', // Repository files will be saved to
  branch: 'main', // Branch to publish to
  token: 'token' // GitHub personal access token
});

// Configure Jekyll publication preset
const jekyll = new JekyllPreset();

// Configure publication
indiekit.set('publication.me', 'https://paulrobertlloyd.com');
indiekit.set('publication.preset', jekyll);
indiekit.set('publication.store', github);

// Create a server
const server = indiekit.server();

// Export server
export default server;
```

### Enable automatic discovery

To ensure Indiekit’s endpoint can be discovered by Micropub clients (and have permission to post to your website), you need to add the follow values to your website’s `<head>`:

```html
<link rel="micropub" href="[INDIEKIT_URL]/micropub">
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
```

## Options

### `application.locale`

The language used in the application interface. See the list of [supported languages](/docs/localisation.md).

Type: `string`\
*Optional*, defaults to system language if supported, else `en` (English)

### `application.mongodbUrl`

To cache files and save information about previously posts and files, you will need to connect Indiekit to a MongoDB database. You can [host one on MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

Type: `URL`\
*Optional*

### `application.name`

The name of your server.

Type: `string`\
*Optional*, defaults to `Indiekit`

### `application.themeColor`

Accent colour used in the application interface.

Type: `string`\
*Optional*, defaults to `#0000ee`

### `application.themeColorScheme`

Color scheme used in the application interface, `automatic`, `light` or `dark`.

Type: `string`\
*Optional*, defaults to `automatic`

### `publication.categories`

A list of categories or tags used on your website. Can be an array of values, or the location of a JSON file providing an array of values.

Type: `Array | URL`\
*Optional*

### `publication.locale`

Your publication’s locale. Currently used to format dates.

Type: `string`\
*Optional*, defaults to `en` (English)

### `publication.me`

Your website’s URL.

Type: `URL`\
*Required*

### `publication.mediaEndpoint`

Indiekit provides a [media endpoint](https://micropub.spec.indieweb.org/#media-endpoint), but you can use a third-party endpoint by setting a value for this option.

Type: `URL`\
*Optional*

### `publication.postTemplate`

A post template is a function that takes post properties received and parsed by the Micropub endpoint and renders them in a given file format, for example, a Markdown file with YAML frontmatter.

Type: `Function`\
*Optional*, defaults to MF2 JSON

### `publication.postTypes`

A set of default paths and templates for different post types. See [Configuring post types](/docs/post-types.md).

Type: `Array`\
*Optional if using a preset*

### `publication.preset`

A [publication preset](/docs/plug-ins.md#publication-presets) plug-in.

Type: `Function`\
*Optional*

### `publication.slugSeparator`

The character used to replace spaces when creating a slug.

Type: `string`\
*Optional*, defaults to `-`

### `publication.store`

A [content store](/docs/plug-ins.md#content-stores) plug-in.

Type: `Function`\
*Required*

### `publication.storeMessageTemplate`

Function used to customise message format. See [Customising commit messages](/docs/commit-messages.md).

Type: `Function`\
*Optional*, defaults to `[action] [postType] [fileType]`

### `publication.sydnicationTargets`

An array of [syndication targets](https://micropub.spec.indieweb.org/#syndication-targets). Example:

```js
[{
  uid: 'https://twitter.com/paulrobertlloyd/',
  name: 'Paul Robert Lloyd on Twitter'
}, {
  uid: 'https://mastodon.social/@paulrobertlloyd',
  name: 'Paul Robert Lloyd on Mastodon'
}, {
  uid: 'https://micro.blog/paulrobertlloyd',
  name: 'Paul Robert Lloyd on Micro.blog'
}]
```

Type: `Array`\
*Optional*

### `publication.timeZone`

The time zone for your publication. By default this is set to `UTC`, however if you want to offset dates according to your time zone you can provide [a time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), for example, `Europe/London`:

```js
indiekit.set('publication.timeZone', 'Europe/London');
```

This option also accepts a number of other values. See [Setting a time zone](/docs/time-zone.md).

Type: `string`\
*Optional*, defaults to `UTC`

### `publication.tokenEndpoint`

An IndieAuth token endpoint.

Type: `URL`\
*Optional*, defaults to `https://tokens.indieauth.com/token`

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
