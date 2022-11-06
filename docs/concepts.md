# Core concepts

A number of terms are used throughout Indiekit’s documentation.

## Content store

A content store is a location where Indiekit can save post content and media files. This could be a Git repository, an FTP server or even a database. A content store plug-in provides this functionality.

For example, if you are saving your posts to the file system, install the [file system store plug-in](https://npmjs.org/package/@indiekit/store-file-system):

```bash
npm install @indiekit/store-file-system
```

Then add it to your configuration file:

```json
{
  "plugins": ["@indiekit/store-file-system"],
  "@indiekit/store-github": {
    "directory": "project/www"
  }
}
```

## Endpoint

An endpoint is a path on your Indiekit server that applications can send requests to or users can access certain features at. By default Indiekit provides the following endpoints:

| Endpoint     | Functionality                                               |
| ------------ | ----------------------------------------------------------- |
| `/files`     | Interface for uploading and managing files.                 |
| `/media`     | Micropub media endpoint for uploading media files.          |
| `/micropub`  | Micropub endpoint for creating post files.                  |
| `/posts`     | Interface for creating and managing posts.                  |
| `/share`     | Interface for creating bookmark posts.                      |
| `/syndicate` | Endpoint that can be pinged to initiate post syndication.   |
| `/token`     | IndieAuth token endpoint for granting and verifying tokens. |

## Publication

A publication is any website which you are publishing content to via Indiekit.

## Publication preset

Indiekit needs to know what [post types](https://indieweb.org/posts#Types_of_Posts) you want to publish (for example notes and photos) and in which format.

This information can be provided by setting the `publication.postTypes` and `publication.postTemplate` configuration values. See customising [post types](configuration/post-types.md) and [post template](configuration/post-template.md).

A publication preset plug-in provides default values for these 2 options (which you can then override).

For example, if you use the Jekyll static site generator, you can install the [Jekyll plug-in](plugins/index.md#jekyll):

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

For example, if you want to syndicate your content to Twitter, you can install the [Twitter plug-in](plugins/index.md#twitter):

```bash
npm install @indiekit/syndicator-twitter
```

Then add it to your configuration file, for example:

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
