# How Indiekit works

The [IndieWeb](https://indieweb.org) is a community of personal websites, connected by simple standards. These follow the principles of publishing content at your own domain name and owning your data.

Indiekit lets your website use these standards and connect with this community, while enabling you to syndicate your content to popular social networks.

## Publish

Let’s say you have installed Indiekit on your web server, and set it up so that it can be reached at `https://indiekit.website.example`.

Any application that supports [the Micropub protocol](https://micropub.spec.indieweb.org) can make the following `POST` request to `https://indiekit.website.example/micropub`:

```bash
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

## Share

Note the `mp-syndicate-to` property in the above example. If you’ve configured Indiekit to syndicate to third-party websites they will appear in this list.

You can then send a second `POST` request, this time to `https://indiekit.website.example/syndicate` along with your access token which you can find on your server’s status page:

```bash
POST /syndicate HTTP/1.1
Host: indiekit.mywebsite.com
Content-type: application/x-www-form-urlencoded

token=XXXXXXX
```

This will tell Indiekit to syndicate the most recent un-syndicated post to the third-party websites listed in the front matter.

::: tip

### Use an outgoing webhook on Netlify

Netlify allows [posting to an outgoing webhook](https://docs.netlify.com/site-deploys/notifications/#outgoing-webhooks) once a deploy has succeeded.

In ‘URL to notify’, enter your server’s syndication endpoint with your access token as the `token` parameter, for example: `https://indiekit.website.example/syndicate?token=XXXXXXX`.
:::

Once this has been completed, Indiekit will update the post, replacing `mp-syndicate-to` with a `syndication` property listing the location of each syndicated copy:

```yaml
---
date: 2021-02-15T21:38:25.343Z
syndication:
  - https://twitter.com/username/1234567890
  - https://mastodon.social/@username/1234567890
---
Hello world
```

## Notify

Indiekit is in the early stages of development so only supports the Micropub protocol and post syndication for now. Future releases may add support for [Webmention](https://www.w3.org/TR/webmention/) and other IndieWeb standards.
