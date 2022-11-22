# Get started

## What is Indiekit?

The [IndieWeb](https://indieweb.org) is a community of personal websites, connected by simple standards. These follow the principles of publishing content at your own domain name and owning your data.

**Indiekit** lets you use these standards to connect with other people’s websites and share your content on popular social networks.

Learn [how Indiekit works →](/introduction)

## Features

- **Publish content to your website** using [apps and services](/clients) that support the [Micropub API](https://micropub.spec.indieweb.org)
- **Save files to a content store** such as GitHub, GitLab or an FTP server
- **Integrate with static site generators** like Jekyll or Hugo
- **Share content** on social networks like Twitter and Mastodon

Indiekit is extensible via its [plugin API](/plugins/api/) and localized for use in [a growing number of languages](/configuration/localisation).

## Requirements

- Your own website, published using a static site generator
- [Node.js](https://nodejs.org) v18+

A [MongoDB](https://www.mongodb.com) database is optional but required for many features to work.

You don’t need access to a [Git](https://git-scm.com) repository, but some hosting providers can deploy and update your server automatically when you commit changes.

## Installation

> Indiekit is designed to be easy to install and use. However, while this project is in its infancy, some aspects may be a bit technical. If you have any questions, please [submit an issue](https://github.com/getindiekit/indiekit/issues) on GitHub.

### 1. Create a configuration file

Run the following command in your terminal to start the configuration wizard:

```sh
npm create indiekit [directory]
```

This is the fastest way to set up a new Indiekit server from scratch.

> Alternatively, you can clone this [example configuration](https://github.com/getindiekit/example-config) repository on GitHub and manually edit the values in the configuration file.

The wizard will walk you through every step of configuring a new server, and will ask you questions about:

- your website’s URL
- if you want to use a [publication preset](/concepts#publication-preset)
- details about your [content store](/concepts#content-store)
- if you want to [syndicate your posts](/concepts#syndicator) to other websites

Once you have completed the configuration wizard, you will have a folder containing a configuration file (`.indiekitrc.json`), as well as a few other files required by Node.js to run your server.

View the full list of [configuration options](/configuration/) to see how you can further customise your Indiekit server.

::: tip
Indiekit needs to be hosted with a publicly addressable URL. However, if you run the command `npm start` in your terminal, you can preview your server by visiting `http://localhost:3000`.
:::

### 2. Set up a web server

Upload the files you created in the previous step to your web server. Assign a publicly addressable port (for example `8080`), and start Indiekit using the following command:

```sh
indiekit serve --port 8080
```

Many hosting providers will automatically assign a port and start and restart Node.js projects. In which case you shouldn’t need to use the above command.

If your host doesn’t provide this functionality, a process manager like [PM2](https://pm2.keymetrics.io) can help.

### 3. Add environment variables

Before you can use Indiekit, you will need to store some secret values that only your server can read. Do this by setting the following environment (or configuration) variables:

- #### `MONGO_URL`

  A database is optional but required for many features to work.

  A MongoDB URL will have the following format: `mongodb+srv://<username>:<password>@<hostname>`

  ::: tip
  Some hosting providers include support for MongoDB. If not, you can create a database for free using [MongoDB’s own Atlas service](https://www.mongodb.com/atlas).
  :::

- #### `PASSWORD_SECRET`

  A password is required to sign in to your server.

  To create a password, visit `/auth/new-password` at the URL where your server is hosted. Enter the password you want to use and click ‘Generate password secret’. Copy the value shown and set it for `PASSWORD_SECRET` in your server’s environment variables.

- #### `SECRET`

  A [randomly generated string](https://generate-random.org/string-generator) that can be used to generate access tokens and passwords. This secret value should be long and not use any recognisable words.

Any plug-ins you’ve configured may also require their own secret values, so add their environment variables as well.

### 4. Enable discovery of your server

To ensure your Indiekit server’s endpoints can be discovered by [Micropub clients](/clients), and to allow them to request permissions to post to your website, add the following values to your website’s `<head>`:

```html
<link rel="authorization_endpoint" href="[INDIEKIT_URL]/auth">
<link rel="token_endpoint" href="[INDIEKIT_URL]/auth/token">
<link rel="micropub" href="[INDIEKIT_URL]/micropub">
```

### 5. Authorize your Micropub client

Any [application that supports the Micropub API](/clients) will ask you to enter your website's URL.

You will then be directed to an authentication page on your Indiekit server. Here you can select which permissions you wish to grant the application before entering your password to allow access.

And that’s it, you’re all set up. Welcome to the IndieWeb! :tada:
