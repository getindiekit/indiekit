---
nav_order: 2
---

# Get started

## Create a configuration file

Create a configuration file, (for example `indiekit.config.js`, but you can call this file whatever you like), and then setup Indiekit and export its server:

```js
import {Indiekit} from '@indiekit/indiekit';

// Create a new indiekit instance
const indiekit = new Indiekit();

// Create a server
const server = indiekit.server();

// Export server
export default server;
```

Start the server with:

```bash
node indiekit.config.js
```

Indiekit can now listen for Micropub requests, but a few bits of information are needed before it can publish content to your website.

## Configure your publication

Indiekit needs to know your website’s URL. You can provide this information using Indiekit’s configuration API, like so:

```js
indiekit.set('publication.me', 'https://paulrobertlloyd.com');
```

## Add a publication preset

Indiekit needs to know what post types you want to publish (for example notes and photos) and in which format. This information can be provided by setting `publication.postTypes` and `publication.postTemplate`. Learn about customising [post types](customisation/post-types.md) and your [post template](customisation/post-template.md).

A publication preset plug-in can provide default values for these options (which you can override in your configuration file).

If you use the Jekyll static site generator, you can install the [Jekyll plug-in](https://www.npmjs.com/package/@indiekit/preset-jekyll):

```bash
npm install @indiekit/preset-jekyll
```

Then add it to your configuration file:

```js
import {JekyllPreset} from '@indiekit/preset-jekyll';
const jekyll = new JekyllPreset();
indiekit.set('publication.preset', jekyll);
```

## Add a content store

Indiekit needs to know where to store your posts and media files. A content store plug-in provides this functionality.

If you are saving your files to GitHub, install the GitHub plug-in:

```bash
npm install @indiekit/store-github
```

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

## Example configuration

With all these settings in place, your configuration file will look something like this:

```js
import {Indiekit} from '@indiekit/indiekit';
import {JekyllPreset} from '@indiekit/preset-jekyll';
import {GithubStore} from '@indiekit/store-github';

// Create a new indiekit instance
const indiekit = new Indiekit();

// Configure GitHub content store
const github = new GithubStore({
  user: 'YOUR_GITHUB_USERNAME',
  repo: 'YOUR_GITHUB_REPOSITORY',
  branch: 'YOUR_GITHUB_BRANCH',
  token: process.env.GITHUB_TOKEN // Use a private environment variable
});

// Configure Jekyll publication preset
const jekyll = new JekyllPreset();

// Configure publication
indiekit.set('publication.me', 'YOUR_WEBSITE_URL');
indiekit.set('publication.preset', jekyll);
indiekit.set('publication.store', github);

// Create a server
const server = indiekit.server();

// Export server
export default server;
```

You can also use this [example configuration](https://github.com/getindiekit/example-config) as a basis for your own.

## Enable automatic discovery

To ensure Indiekit’s endpoint can be discovered by Micropub clients (and have permission to post to your website), you need to add the follow values to your website’s `<head>`:

```html
<link rel="micropub" href="[INDIEKIT_URL]/micropub">
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
```
