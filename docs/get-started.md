# Get started

## Install Indiekit

You can install indiekit using:

```bash
npm init && npm install @indiekit/indiekit
```

You can then start your server using:

```bash
npx indiekit serve
```

Indiekit can now listen for Micropub requests, but a few bits of information are needed before it can publish content to your website.

## Configure your publication

Indiekit needs to know your website’s URL. You can provide this information using Indiekit’s [configuration API](configuration/index.md). You can add options to a `indiekit` key in `package.json`:

```jsonc
// package.json
{
  "name": "my-indiekit-server",
  "version": "1.0.0",
  "dependencies": {
    "@indiekit/indiekit": "^1.0.0"
  },
  "indiekit": {
    "publication": {
      "me": "https://paulrobertlloyd.com"
    }
  }
}
```

## Add a publication preset

Indiekit needs to know what post types you want to publish (for example notes and photos) and in which format. This information can be provided by setting `publication.postTypes` and `publication.postTemplate`. Learn about customising [post types](configuration/post-types.md) and your [post template](configuration/post-template.md).

A publication preset plug-in can provide default values for these options (which you can override in your configuration file).

If you use the Jekyll static site generator, you can install the [Jekyll plug-in](https://www.npmjs.com/package/@indiekit/preset-jekyll):

```bash
npm install @indiekit/preset-jekyll
```

Then add it to the `plugins` array in your `indiekit` configuration object:

```jsonc
// package.json
{
  "name": "my-indiekit-server",
  "version": "1.0.0",
  "dependencies": {
    "@indiekit/indiekit": "^1.0.0",
    "@indiekit/preset-jekyll": "^1.0.0"
  },
  "indiekit": {
    "plugins": [
      "@indiekit/preset-jekyll"
    ],
    "publication": {
      "me": "https://paulrobertlloyd.com"
    }
  }
}
```

## Add a content store

Indiekit needs to know where to store your posts and media files. A content store plug-in provides this functionality.

If you are saving your files to GitHub, install the GitHub plug-in:

```bash
npm install @indiekit/store-github
```

Then add it to the `plugins` array in your `indiekit` configuration object. If it has options, these are added under the name of the plug-in’s package name:

```jsonc
// package.json
{
  "name": "my-indiekit-server",
  "version": "1.0.0",
  "dependencies": {
    "@indiekit/indiekit": "^1.0.0",
    "@indiekit/preset-jekyll": "^1.0.0",
    "@indiekit/store-github": "^1.0.0"
  },
  "indiekit": {
    "plugins": [
      "@indiekit/preset-jekyll",
      "@indiekit/store-github"
    ],
    "publication": {
      "me": "https://paulrobertlloyd.com"
    },
    "@indiekit/store-github": {
      "user": "username",
      "repo": "reponame",
      "branch": "main"
    }
  }
}
```

If you are saving your configuration file in a public location, you should keep any passwords or API tokens private. For this plug-in, you can do this by creating a `GITHUB_TOKEN` [environment variable][env] with your GitHub personal access token as its value.

## Enable automatic discovery

To ensure Indiekit’s endpoint can be discovered by Micropub clients (and have permission to post to your website), you need to add the follow values to your website’s `<head>`:

```html
<link rel="micropub" href="[INDIEKIT_URL]/micropub">
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
```

[env]: https://devcenter.heroku.com/articles/config-vars
