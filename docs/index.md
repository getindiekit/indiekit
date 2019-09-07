*An IndieWeb publishing toolkit*

![](https://raw.githubusercontent.com/paulrobertlloyd/indiekit/master/app/static/logo.svg?sanitize=true)

The immediate goal of this project is to provide a [Micropub](https://www.w3.org/TR/micropub/) endpoint that can be hosted on a service like Heroku, configured via files stored on a GitHub repo, and save posts back to that repo for publishing with a static site generator such as [Eleventy](https://www.11ty.io), [Hugo](https://gohugo.io) or [Jekyll](https://jekyllrb.com). The software is fully documented and tested.

A long term ambition is to build a tool that supports different publishing destinations, other social publishing specifications (Webmention, Microsub, ActivityPub etc.) and integrates with a range of content management systems.

<a class="github-button" href="https://github.com/paulrobertlloyd/indiekit" data-size="large" data-show-count="true" aria-label="Star IndieKit on GitHub">Star</a>

## Documentation

* **[Deploying the application](https://paulrobertlloyd.github.io/indiekit/deploy)**
* **[Configuring IndieKit to work with your website](https://paulrobertlloyd.github.io/indiekit/config)**

## Features

✏️ **Create posts** with JSON or `x-www-form-urlencoded` syntaxes

🔄 **Update posts** with support for `replace`, `add` and `remove` operations

❌ **Delete posts** with support for `delete` and `undelete` actions

🖼 **Upload media** via media endpoint (or by including `multipart/form-data` in a request)

🔍 **Query the endpoint** with support for [a number of different queries](https://paulrobertlloyd.github.io/indiekit/query)

🌈 **Configure** post templates and destination file paths. This means IndieKit can support a variety of static site generators and setups.

🌐 **Internationalisation** of commit messages, date formats and public pages. Currently English and German are supported.

## Credits

This tool is inspired by [similar projects](https://paulrobertlloyd.github.io/indiekit/projects) made by members of the [IndieWeb community](https://indieweb.org).

Logo adapted from [‘to merge’](https://www.toicon.com/icons/afiado_merge) icon by Susana Passinhas.

<script async defer src="https://buttons.github.io/buttons.js"></script>
