---
nav_order: 6
---

# Plug-ins

You can find more plug-ins on npm under the [`indiekit-plugin`](https://www.npmjs.com/search?q=keywords%3Aindiekit-plugin) tag.

## Content stores

A [content store](../concepts#content-store) is a location where Indiekit can save post content and media files. Plug-ins are available for the following platforms:

- [@indiekit/store-bitbucket](https://npmjs.org/package/@indiekit/store-bitbucket)
- [@indiekit/store-file-system](https://npmjs.org/package/@indiekit/store-file-system)
- [@indiekit/store-ftp](https://npmjs.org/package/@indiekit/store-ftp)
- [@indiekit/store-gitea](https://npmjs.org/package/@indiekit/store-gitea)
- [@indiekit/store-github](https://npmjs.org/package/@indiekit/store-github)
- [@indiekit/store-gitlab](https://npmjs.org/package/@indiekit/store-gitlab)

## Endpoints

An [endpoint](../concepts#endpoint) is a path on your Indiekit server that applications can send requests to or users can access certain features at.

- [@indiekit/endpoint-image](https://npmjs.org/package/@indiekit/endpoint-image) (Built-in)  
  Image resizing endpoint for Indiekit. Adds real-time image processing routes that can be used by your publication.

- [@indiekit/endpoint-micropub](https://npmjs.org/package/@indiekit/endpoint-micropub) (Built-in)  
  Micropub endpoint for Indiekit. Enables publishing content to your website using the Micropub protocol.

- [@indiekit/endpoint-media](https://npmjs.org/package/@indiekit/endpoint-media) (Built-in)  
  Micropub media endpoint for Indiekit. Enables publishing media files (audio, photos, videos) to your website using the Micropub protocol.

- [@indiekit/endpoint-share](https://npmjs.org/package/@indiekit/endpoint-share) (Built-in)  
  Share endpoint for Indiekit. Provides a simple interface for [bookmarking](https://indieweb.org/bookmark) websites and publishing them on your website.

- [@indiekit/endpoint-syndicate](https://npmjs.org/package/@indiekit/endpoint-syndicate) (Built-in)  
  Syndication endpoint for Indiekit. Provides an endpoint you can ping to check that recently published posts have been syndicated to any configured targets such as Twitter or Mastodon.

- [@indiekit/endpoint-token](https://npmjs.org/package/@indiekit/endpoint-token) (Built-in)  
  Token endpoint for Indiekit. Provides an IndieAuth token endpoint to verify access tokens.

## Publication presets

A [publication preset](../concepts#publication-preset) provides default values for post types and post templates. Plug-ins are available for the following platforms:

- [@indiekit/preset-hugo](https://npmjs.org/package/@indiekit/preset-hugo)
- [@indiekit/preset-jekyll](https://npmjs.org/package/@indiekit/preset-jekyll)

## Syndicators

A [syndicator](../concepts#syndicator) enables content to be posted to third-party websites, in addition to your own. Plug-ins are available for the following platforms:

- [@indiekit/syndicator-internet-archive](https://npmjs.org/package/@indiekit/syndicator-internet-archive)
- [@indiekit/syndicator-mastodon](https://npmjs.org/package/@indiekit/syndicator-mastodon)
- [@indiekit/syndicator-twitter](https://npmjs.org/package/@indiekit/syndicator-twitter)
