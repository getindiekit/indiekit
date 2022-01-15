---
nav_order: 1
---

# How Indiekit works

## Publishing

Let’s say you have installed Indiekit on your web server, and set it up so that it can be reached at `https://indiekit.website.example`.

Any application that supports [the Micropub protocol](https://micropub.spec.indieweb.org) can make the following `POST` request to `https://indiekit.website.example/micropub`:

```http
POST /micropub HTTP/1.1
Host: indiekit.mywebsite.com
Content-type: application/x-www-form-urlencoded
Authorization: Bearer XXXXXXX

h=entry
&content=Hello+world
```

Indiekit will recognise this as a Micropub request and create a new note post with the content ‘Hello world’.

If you’ve configured Indiekit to publish files to GitHub for a site generated using [Jekyll](https://jekyllrb.com), Indiekit will create the following file and commit it to your repository at your specified location:

```yaml
---
date: 2021-02-15T21:38:25.343Z
mp-syndicate-to:
  - https://twitter.com/username
  - https://mastodon.social/@username
---
Hello world
```

Assuming your publication is deployed every time there is a new commit, this new post will appear on your website (this may take a few minutes if you’re using a static site generator).

## Syndication

Note the `mp-syndicate-to` property in the above example. If you’ve configured Indiekit to syndicate to third-party websites they will appear in this list.

You can then send a second `POST` request, this time to `https://indiekit.website.example/syndicate` along with a secret token:

```http
POST /syndicate HTTP/1.1
Host: indiekit.mywebsite.com
Content-type: application/x-www-form-urlencoded
Authorization: Bearer XXXXXXX

token=XXXXXXX
```

This will tell Indiekit to syndicate the most recent un-syndicated post to the third-party websites listed in the front matter. Once this has been completed, Indiekit will update the post, replacing `mp-syndicate-to` with a `syndication` property listing the location of each syndicated copy:

```yaml
---
date: 2021-02-15T21:38:25.343Z
syndication:
  - https://twitter.com/username/1234567890
  - https://mastodon.social/@username/1234567890
---
Hello world
```

## Notifications

Indiekit is in the early stages of development so only supports the Micropub protocol and post syndication for now. Future releases may add support for [Webmention](https://www.w3.org/TR/webmention/) and other IndieWeb standards.
