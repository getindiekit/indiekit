# @indiekit/endpoint-syndicate

Syndication endpoint for Indiekit. Provides an endpoint you can ping to check that recently published posts have been posted to configured syndication targets.

## Installation

`npm install @indiekit/endpoint-syndicate`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-syndicate` to your configuration, specifying options as required:

```jsonc
{
  "@indiekit/endpoint-syndicate": {
    "mountPath": "/syndikat", // de-DE
  },
}
```

## Options

| Option      | Type     | Description                                                         |
| :---------- | :------- | :------------------------------------------------------------------ |
| `mountPath` | `string` | Path to syndication endpoint. _Optional_, defaults to `/syndicate`. |

## Supported endpoint queries

- URL to syndicate: `/syndicate?source_url=https%3A%2F%2Fwebsite.example%2Fposts%2F1`

## Authorization

Authorization is needed to update posts with any syndicated URLs. This can be done in a few different ways:

### Query string

Include your server’s access token as the `token` query:

```http
POST /syndicate?token=[ACCESS_TOKEN] HTTP/1.1
Host: indiekit.website.example
Accept: application/json
```

You can find an access token on your server’s status page.

### Form body

Include a value for `access_token` in your form submission:

```http
POST /syndicate HTTP/1.1
Host: indiekit.website.example
Content-type: application/x-www-form-urlencoded
Accept: application/json

access_token=[ACCESS_TOKEN]
```

You can find an access token on your server’s status page.

### Using a webhook secret (Netlify only)

If you are using [Netlify](https://www.netlify.com) to host your website, you can send a notification to the syndication endpoint once a deployment has been completed.

First, create an environment variable for your Indiekit server called `WEBHOOK_SECRET` and give it a secret, hard-to-guess value.

Then on Netlify, in your site’s ‘Build & Deploy’ settings, add an [outgoing webhook](https://docs.netlify.com/site-deploys/notifications/#outgoing-webhooks) with the following values:

- **Event to listen for:** ‘Deploy succeeded’
- **URL to notify:** `[YOUR_INDIEKIT_URL]/syndicate`
- **JWS secret token:** The same value you used for `WEBHOOK_SECRET`
