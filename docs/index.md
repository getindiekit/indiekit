*An IndieWeb publishing toolkit*

![](https://raw.githubusercontent.com/paulrobertlloyd/indiekit/master/app/static/logo.svg?sanitize=true)

The immediate goal of this project is to provide a [Micropub](https://www.w3.org/TR/micropub/) endpoint that can be hosted on a service like Heroku, configured via files stored on a GitHub repo, and save posts back to that repo for publishing with a static site generator like [Jekyll](https://jekyllrb.com), [Hugo](https://gohugo.io) or [Eleventy](https://www.11ty.io). The software is [fully documented](https://paulrobertlloyd.github.io/indiekit/app) and tested.

A long term ambition is to build a tool that supports different publishing destinations, other social publishing specifications (Webmention, Microsub, ActivityPub etc.) and integrates with a range of content management systems.

This tool is inspired by [similar projects](https://paulrobertlloyd.github.io/indiekit/projects) made by members of the [IndieWeb community](https://indieweb.org).

<a class="github-button" href="https://github.com/paulrobertlloyd/indiekit" data-size="large" data-show-count="true" aria-label="Star IndieKit on GitHub">Star</a>

## Features

### Micropub
✏️ **[Creating posts](https://www.w3.org/TR/micropub/#create)** using JSON or `x-www-form-urlencoded` syntax

🔄 **[Updating posts](https://www.w3.org/TR/micropub/#update)** with support for *replace*, *add* and *remove* operations

❌ **[Deleting posts](https://www.w3.org/TR/micropub/#delete)** with support for `delete` and `undelete` actions

🖼 **[Uploading media](https://www.w3.org/TR/micropub/#media-endpoint)** via media endpoint (or by including `multipart/form-data` in a request)

🔍 **[Querying endpoints](https://www.w3.org/TR/micropub/#querying)** with support for:
  * configuration (`/micropub?q=config`)
  * media endpoint (`/micropub?q=media-endpoint`)
  * syndication targets (`/micropub?q=syndicate-to`)
  * categories (`/micropub?q=category`)
  * previous posts (`/micropub?q=source`)
  * source content (`/micropub?q=source&url=[url]`)
  * supported vocabularies (`/micropub?q=post-types`)
  * last uploaded file (`/media?q=last`)

### Customisation
🌈 **Configurable post templates** and destination file paths, enabling support for a wide variety of static site generators and setups. A set of [default templates](https://paulrobertlloyd.github.io/indiekit/config#post-types) are provided which are designed to work with a standard [Jekyll](https://jekyllrb.com) install.

🌐 **Internationalisation** of commit messages, date formats and public pages. Current languages provided:
  * English
  * Deutsch

## Documentation

* **[Getting started](https://paulrobertlloyd.github.io/indiekit/deploy)**: Deploying the application.
* **[Usage](https://paulrobertlloyd.github.io/indiekit/config)**: Configuring your website to work with IndieKit.
* **[Glossary](https://paulrobertlloyd.github.io/indiekit/glossary)**: Terms used throughout the application and documentation.

## Credits

Logo adapted from [‘to merge’](https://www.toicon.com/icons/afiado_merge) icon by Susana Passinhas.

<script async defer src="https://buttons.github.io/buttons.js"></script>
