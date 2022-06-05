---
nav_order: 5
---

# Core concepts

A number of terms are used throughout Indiekit’s documentation.

## Content store

A content store is a location where Indiekit can save post content and media files. This could be a Git repository, an FTP server or even a database. A content store plug-in provides this functionality.

For example, if you are saving your files to GitHub, install the [GitHub plug-in](plug-ins.md#github):

```bash
npm install @indiekit/store-github
```

Then add it to your configuration file:

```json
{
  "plugins": ["@indiekit/store-github"],
  "@indiekit/store-github": {
    "user": "YOUR_GITHUB_USERNAME",
    "repo": "YOUR_GITHUB_REPOSITORY",
    "branch": "YOUR_GITHUB_BRANCH"
  }
}
```

{% include_relative _includes/plugin-requires-secrets.md %}

## Endpoint

An endpoint is a path on your Indiekit server that applications can send requests to or users can access certain features at. By default Indiekit provides the following endpoints:

| Endpoint     | Functionality                                             |
| ------------ | --------------------------------------------------------- |
| `/media`     | Micropub media endpoint for uploading media files.        |
| `/micropub`  | Micropub endpoint for creating post files.                |
| `/share`     | Interface to create bookmark posts.                       |
| `/syndicate` | Endpoint that can be pinged to initiate post syndication. |

## Publication

A publication is any website which you are publishing content to via Indiekit.

## Publication preset

Indiekit needs to know what [post types](https://indieweb.org/posts#Types_of_Posts) you want to publish (for example notes and photos) and in which format.

This information can be provided by setting the `publication.postTypes` and `publication.postTemplate` configuration values. See customising [post types](customisation/post-types.md) and [post template](customisation/post-template.md).

A publication preset plug-in provides default values for these 2 options (which you can then override).

For example, if you use the Jekyll static site generator, you can install the [Jekyll plug-in](plug-ins.md#jekyll):

```bash
npm install @indiekit/preset-hugo
```

Then add it to your configuration file:

```json
{
  "plugins": ["@indiekit/preset-hugo"],
  "@indiekit/preset-hugo": {
    "frontMatterFormat": "json"
  }
}
```

## Syndicator

A key idea of the IndieWeb movement is [POSSE](https://indieweb.org/POSSE) (_Publish on your Own Site, Syndicate Elsewhere_). This is the practice of posting content on your own website, then publishing copies or sharing it on third-party websites. A syndicator plug-in provides this functionality.

For example, if you want to syndicate your content to Twitter, you can install the [Twitter plug-in](plug-ins.md#twitter):

```bash
npm install @indiekit/syndicator-twitter
```

Then add it to your configuration file:

```json
{
  "plugins": ["@indiekit/syndicator-twitter"],
  "@indiekit/syndicator-twitter": {
    "checked": true,
    "forced": true,
    "user": "YOUR_TWITTER_USERNAME"
  }
}
```

The `checked` option is used to tell Micropub clients whether a syndication target should be enabled or not by default.

Not all clients allow you to disable or enable syndication targets. Setting the `forced` option to `true` will ensure that a syndication target is enabled regardless.

{% include_relative _includes/plugin-requires-secrets.md %}

[env]: https://devcenter.heroku.com/articles/config-vars
