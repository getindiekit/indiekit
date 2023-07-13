# Get started

## What is Indiekit?

The [IndieWeb](https://indieweb.org) is a community of personal websites, connected by simple standards. These follow the principles of publishing content at your own domain name and owning your data.

**Indiekit** uses these standards to help you publish content to your own website and then share it on popular social networks.

<picture>
  <source srcset="/interface-dark.png" media="(prefers-color-scheme: dark)">
  <img src="/interface-light.png" alt="Indiekit’s application management interface.">
</picture>

## Features

- **Publish content to your website** using Indiekit’s own content management system, or [applications that support the Micropub API](clients.md)
- **Save files to a content store** such as GitHub, GitLab or an FTP server
- **Integrate with static site generators** like Jekyll or Hugo
- **Share content** on social networks like Mastodon and Twitter
- **Customise everything** from the interface theme to the format of your commit messages

Indiekit is extensible via its [plug-in API](plugins/api/index.md) and localised for use in [a growing number of languages](configuration/localisation.md).

## Requirements

- Your own website, published using a static site generator
- [Node.js](https://nodejs.org) v18+

A [MongoDB](https://www.mongodb.com) database is optional, but required for the following features to work:

- Viewing, editing, deleting and restoring previously published posts
- Syndicating posts
- Viewing and deleting previously uploaded media files

::: info Note
This project is known to work with MongoDB v4.4 or later. It may also work with the last openly licenced version, v4.0.3, but this has not been tested.
:::

You don’t need access to a [Git](https://git-scm.com) repository, but some hosts can deploy and update your server automatically when you commit changes.

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
- if you want to use a [publication preset](concepts.md#publication-preset)
- details about your [content store](concepts.md#content-store)
- if you want to [syndicate your posts](concepts.md#syndicator) to other websites

Once you have completed the configuration wizard, you will have a folder containing a configuration file (`.indiekitrc.json`), as well as a few other files required by Node.js to run your server.

View the full list of [configuration options](configuration/index.md) to see how you can further customise your Indiekit server.

::: tip
Indiekit needs to be hosted with a publicly addressable URL. However, if you run the command `npm start` in your terminal, you can preview your server by visiting `http://localhost:3000`.
:::

### 2. Set up a web server

The steps needed to set up a web server will vary depending on your host. Some are designed such that many of the following steps are automated, whereas others will require manual intervention.

#### Uploading configuration files

Some hosts provide command line interfaces (CLI) that enable setting up a new project space and uploading files from your computer. Others will suggest creating a Git repository, and syncing changes between that and a project space that way.

However, if you need to copy the configuration files manually, don’t copy the `node_modules` folder - this folder can be quite large, and its contents change depending on the computer Node.js is being run on.

#### Installing dependencies

Some hosts will install dependencies automatically, so you can skip this step.

If not, type the following command:

```sh
npm ci
```

This will generate the `node_modules` folder for your particular server.

#### Starting your server

Some hosts may assign a port, start and restart Node.js servers automatically.

If your host doesn’t provide this functionality, you should assign a publicly addressable port (for example `8080`) and start your Indiekit server using the following command:

```sh
npx indiekit serve --port 8080
```

If your host doesn’t manage starting and restarting a Node.js server, a process manager like [PM2](https://pm2.keymetrics.io) can be used instead.

### 3. Add environment variables

Before you can use Indiekit, some extra configuration values that only you and your server can see need to be set. Look on your host for environment (or configuration) variables, and add the following values:

#### `SECRET`

A [randomly generated string](https://generate-random.org/string-generator) used to generate access tokens and passwords.

This secret value should be long and not use any recognisable words.

#### `PASSWORD_SECRET`

An encrypted string used to confirm that you have entered your chosen password.

Follow these steps to create this value:

1. check that you have set a value for `SECRET` in your environment variables.
2. visit `/auth/new-password` at the URL where your server is hosted.
3. enter the password you want to use and click ‘Generate password secret’.
4. copy the value shown and set it for `PASSWORD_SECRET` in your environment variables.

#### `MONGO_URL` (optional)

A [MongoDB connection string](https://www.mongodb.com/docs/manual/reference/connection-string/) if you want to use features that require a database.

This is a URL with the following format: `mongodb://<username>:<password>@<hostname>:<port>`.

The URL may start with `mongodb+srv://` if you’re connecting to a server cluster, not a single server.

::: tip
Some hosts include support for MongoDB. If not, you can create a database for free using [MongoDB Atlas](https://www.mongodb.com/atlas).
:::

Any plug-ins you’ve configured may also require their own secret values, so add their environment variables as well.

### 4. Enable discovery of your server

To ensure your Indiekit server’s endpoints can be discovered by [Micropub clients](clients.md), and to allow them to request permissions to post to your website, add the following values to your website’s `<head>`:

```html
<link rel="authorization_endpoint" href="[INDIEKIT_URL]/auth">
<link rel="token_endpoint" href="[INDIEKIT_URL]/auth/token">
<link rel="micropub" href="[INDIEKIT_URL]/micropub">
```

### 5. Authorize your Micropub client

Any [application that supports the Micropub API](clients.md) will ask you to enter your website's URL.

You will then be directed to an authentication page on your Indiekit server. Here you can select which permissions you wish to grant the application before entering your password to allow access.

And that’s it, you’re all set up. Welcome to the IndieWeb! :tada:
