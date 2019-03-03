*An IndieWeb publishing toolkit*

![](https://raw.githubusercontent.com/paulrobertlloyd/indiekit/master/app/static/logo.svg?sanitize=true)

The immediate goal of this project is to provide a [Micropub](https://www.w3.org/TR/micropub/) endpoint that can be hosted on a service like Heroku, configured via files stored on a GitHub repo, and save posts back to that repo for publishing with a static site generator like [Jekyll](https://jekyllrb.com), [Hugo](https://gohugo.io) or [Eleventy](https://www.11ty.io). The software is [fully documented](https://paulrobertlloyd.github.io/indiekit/app) and tested.

A long term ambition is to build a tool that supports different publishing destinations, other social publishing specifications (Webmention, Microsub, ActivityPub etc.) and integrates with a range of content management systems.

This tool is inspired by [similar projects](https://paulrobertlloyd.github.io/indiekit/projects) made by members of the [IndieWeb community](https://indieweb.org).

<a class="github-button" href="https://github.com/paulrobertlloyd/indiekit" data-size="large" data-show-count="true" aria-label="Star IndieKit on GitHub">Star</a>

## Features

* **Creating posts** using JSON or `x-www-form-urlencoded` syntax
* **Deleting posts** (`delete` action only)
* **Uploading media** via a media endpoint or by providing `multipart/form-data` in a request
* **Querying** for configuration, source content and syndication targets. Additonal support for [querying supported vocabularies](https://indieweb.org/Micropub-extensions#Query_for_Supported_Properties).

## Documentation

* [Getting started](https://paulrobertlloyd.github.io/indiekit/deploy): Deploying the application.
* [Usage](https://paulrobertlloyd.github.io/indiekit/config): Configuring your website to work with IndieKit.
* [Testing](https://paulrobertlloyd.github.io/indiekit/test): Testing the service locally and running automated tests.
* [Glossary](https://paulrobertlloyd.github.io/indiekit/glossary): Terms used throughout the application and documentation.
* [Application](https://paulrobertlloyd.github.io/indiekit/app): Functions used within the application.

## Credits

Logo adapted from [‘to merge’](https://www.toicon.com/icons/afiado_merge) icon by Susana Passinhas.

<script async defer src="https://buttons.github.io/buttons.js"></script>
