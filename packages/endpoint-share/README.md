# @indiekit/endpoint-share

Share endpoint for Indiekit. Provides a simple interface for bookmarking websites and publishing them on your website. Inspired and developed from [an idea originally described by Max Böck](https://mxb.dev/blog/indieweb-link-sharing/).

## Installation

`npm install @indiekit/endpoint-share`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-share` to your configuration, specifying options as required:

```jsonc
{
  "@indiekit/endpoint-share": {
    "mountPath": "/teilen", // de-DE
  },
}
```

## Options

| Option      | Type     | Description                                             |
| :---------- | :------- | :------------------------------------------------------ |
| `mountPath` | `string` | Path to share screen. _Optional_, defaults to `/share`. |

## Pre-filling the form

The share endpoint accepts query parameters to pre-fill form fields. This allows external services and browser extensions to populate the form automatically.

| Parameter | Description                        |
| :-------- | :--------------------------------- |
| `url`     | URL to bookmark.                   |
| `name`    | Title of the post.                 |
| `content` | Body text of the post. _Optional_. |

To enable services like [ShareOpenly](https://shareopenly.org) to share to your site, add a `<link>` element with `rel="share-url"` to your homepage:

```html
<link
  rel="share-url"
  href="https://example.com/share?url={url}&name={title}&content={text}"
/>
```

Replace `https://example.com/share` with the URL of your share endpoint.
