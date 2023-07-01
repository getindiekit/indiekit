# Supported IndieWeb specifications

The current status of Indiekit’s support for IndieWeb specifications and protocols.

## IndieAuth

[IndieAuth](https://indieauth.spec.indieweb.org) is an identity layer on top of OAuth 2.0, primarily used to obtain an OAuth 2.0 Bearer Token for use by Micropub clients. Users and clients are all represented by URLs. IndieAuth enables clients to verify the identity of a user, as well as to obtain an access token that can be used to access resources under the control of the user.

### Discovery

* [x] [IndieAuth server metadata](https://indieauth.spec.indieweb.org/#indieauth-server-metadata)
* [x] [Application information](https://indieauth.spec.indieweb.org/#application-information)

### Authorization

* [x] Redeem `authorization_code` for a [profile URL](https://indieauth.spec.indieweb.org/#profile-url-response)
* [x] Redeem `authorization_code` for an [access token](https://indieauth.spec.indieweb.org/#access-token-response)
* [ ] Redeem `authorization_code` for [profile information](https://indieauth.spec.indieweb.org/#profile-information)
* [ ] Redeem `refresh_token` for a [refreshed access token](https://indieauth.spec.indieweb.org/#refresh-tokens)
* [x] [Error responses](https://indieauth.spec.indieweb.org/#error-responses)

Indiekit uses Proof Key for Code Exchange (PKCE), but doesn’t require clients to issue a code challenge. This is to support clients using earlier versions of IndieAuth.

### Access tokens

* [x] [Token introspection](https://indieauth.spec.indieweb.org/#access-token-verification)
* [ ] [Token revocation](https://indieauth.spec.indieweb.org/#token-revocation)

### User information

* [ ] [Get user information](https://indieauth.spec.indieweb.org/#user-information)

## Micropub

[Micropub](https://micropub.spec.indieweb.org) is used to create, update and delete posts on one’s own domain using third-party clients. Web apps and native apps can use Micropub to post and edit articles, short notes, comments, likes, photos, events or other kinds of posts on your own website.

* [x] [Create](https://micropub.spec.indieweb.org/#create) posts (using both `x-www-form-urlencoded` and JSON syntaxes)
* [x] [Update](https://micropub.spec.indieweb.org/#update) posts (replacing, adding and deleting properties)
* [x] [Delete](https://micropub.spec.indieweb.org/#delete) and undelete posts
* [x] [Query](https://micropub.spec.indieweb.org/#querying)
* [x] [Upload media](https://micropub.spec.indieweb.org/#media-endpoint)
* [x] [Error response](https://micropub.spec.indieweb.org/#error-response)

The following [scopes](https://indieweb.org/scope) are supported:

* `create`: User can create and undelete posts, and upload media
* `update`: User can update posts
* `delete`: User can delete posts
* `draft`: User can only create and update draft posts
* `media`: User can upload media

### Extensions

* [x] [Category](https://github.com/indieweb/micropub-extensions/issues/5) query
* [x] [Post list](https://github.com/indieweb/micropub-extensions/issues/4) query
* [x] [Supported queries](https://github.com/indieweb/micropub-extensions/issues/7) query
* [x] [Supported vocabulary](https://github.com/indieweb/micropub-extensions/issues/1) query
* [x] [Media source](https://github.com/indieweb/micropub-extensions/issues/14) query, including [filtering by URL parameter](https://github.com/indieweb/micropub-extensions/issues/37)[^1]
* [x] [Pagination](https://github.com/indieweb/micropub-extensions/issues/48)
* [x] [Filter](https://github.com/indieweb/micropub-extensions/issues/34) query parameter
* [x] [Limit](https://github.com/indieweb/micropub-extensions/issues/35) query parameter
* [x] [Offset](https://github.com/indieweb/micropub-extensions/issues/36) query parameter
* [x] [Delete media](https://github.com/indieweb/micropub-extensions/issues/30)

[^1]: A media endpoint source query includes the following properties in its [response](https://github.com/indieweb/micropub-extensions/issues/13): `content-type`, `media-type`, `published` and `url`.

### Server commands

* [x] `mp-photo-alt`: Alternative text to use for a published photo
* [x] `mp-slug`: URL slug to use in published post
* [x] `mp-syndicate-to`: Which syndication targets to syndicate post to

## Microsub

[Microsub](https://indieweb.org/Microsub-spec) provides a standardized way for clients to consume and interact with feeds collected by a server.

Microsub is not currently supported by Indiekit, but might be in the future.

## Webmention

[Webmention](https://webmention.net/draft) is a simple way to notify any URL when you mention it on your site. From the receiver's perspective, it's a way to request notifications when other sites mention it.

* [ ] [Sending Webmentions](https://webmention.net/draft/#sending-webmentions)
* [ ] [Receiving Webmentions](https://webmention.net/draft/#receiving-webmentions)
