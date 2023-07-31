# Core concepts

Several terms are used throughout Indiekit’s documentation.

## Content store

A content store is a location where Indiekit can save post content and media files. This could be a Git repository, an FTP server or even a database. A content store plug-in provides this functionality.

For example, if you are saving your posts to the file system, install the [file system store](https://npmjs.org/package/@indiekit/store-file-system):

```sh
npm install @indiekit/store-file-system
```

Then add it to your configuration file:

```json
{
  "plugins": ["@indiekit/store-file-system"],
  "@indiekit/store-file-system": {
    "directory": "project/www"
  }
}
```

## Endpoint

An endpoint is a path on your Indiekit server that applications can send requests to or users can access certain features at. By default Indiekit provides the following endpoints:

| Endpoint     | Functionality                                               |
| ------------ | ----------------------------------------------------------- |
| `/auth`      | Endpoint for authenticating users and applications.         |
| `/files`     | Interface for uploading and managing files.                 |
| `/media`     | Micropub media endpoint for uploading media files.          |
| `/micropub`  | Micropub endpoint for creating post files.                  |
| `/posts`     | Interface for creating and managing posts.                  |
| `/share`     | Interface for creating bookmark posts.                      |
| `/syndicate` | Endpoint that can be pinged to initiate post syndication.   |

## Publication

A publication is any website to which you are publishing content to via Indiekit.

## Publication preset

Indiekit needs to know what [post types](https://indieweb.org/posts#Types_of_Posts) you want to publish (for example notes and photos) and in which format.

This information can be provided by setting the `publication.postTypes` and `publication.postTemplate` configuration values. See customising [post types](configuration/post-types.md) and [post template](configuration/post-template.md).

A publication preset plug-in provides default values for these 2 options (which you can then override).

For example, if you use the Hugo static site generator, you can install the [Hugo publication preset](plugins/index.md#hugo):

```sh
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

## Syndication

Indiekit can be setup to share posts on other social networks, a process sometimes called syndication or [cross-posting](https://indieweb.org/cross-posting).

Syndicator plug-ins provide this functionality. For example, if you want to syndicate your content to Mastodon, you can install the [Mastodon syndicator](plugins/index.md#mastodon):

```sh
npm install @indiekit/syndicator-mastodon
```

Then add it to your configuration file, for example:

```json
{
  "plugins": ["@indiekit/syndicator-mastodon"],
  "@indiekit/syndicator-mastodon": {
    "checked": true,
    "url": "https://mastodon.example",
    "user": "username"
  }
}
```

The `checked` option is used to tell [Micropub clients](clients.md) whether a syndication target should be enabled or not by default.

### Using the application interface to syndicate a post

A ‘Syndicate post’ button is shown on the detail page for any post that can be syndicated. Clicking this button will syndicate the post to any outstanding syndication targets (shown under the `mp-syndicate-to` property).

### Using the syndication endpoint

Use the syndication endpoint to check if any posts are awaiting syndication.

This `POST` request should include your server’s access token. You can find this on your server’s status page.

This token can be provided in the URL using the `token` query parameter:

```sh
POST /syndicate?token=[ACCESS_TOKEN] HTTP/1.1
Host: indiekit.example
Accept: application/json
```

You can also use the `access_token` form field:

```sh
POST /syndicate HTTP/1.1
Host: indiekit.example
Content-type: application/x-www-form-urlencoded
Accept: application/json

access_token=[ACCESS_TOKEN]
```

### Using an outgoing webhook on Netlify

If you are using [Netlify](https://www.netlify.com) to host your website, you can ping the syndication endpoint once a deployment has completed.

First, create an environment variable for your Indiekit server called `WEBHOOK_SECRET` and give it a secret, hard-to-guess value.

Then on Netlify, in your site’s ‘Build & Deploy’ settings, add an [outgoing webhook](https://docs.netlify.com/site-deploys/notifications/#outgoing-webhooks) with the following values:

* **Event to listen for:** ‘Deploy succeeded’
* **URL to notify:** `[YOUR_INDIEKIT_URL]/syndicate`
* **JWS secret token:** The same value used for `WEBHOOK_SECRET`
