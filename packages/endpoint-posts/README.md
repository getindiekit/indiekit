# @indiekit/endpoint-posts

Post management endpoint for Indiekit. View posts published by your Micropub endpoint and publish new posts to it.

## Installation

`npm install @indiekit/endpoint-posts`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-posts` to your configuration, specifying options as required:

```jsonc
{
  "@indiekit/endpoint-posts": {
    "mountPath": "/artikel", // de-DE
  },
}
```

## Options

| Option      | Type     | Description                                                     |
| :---------- | :------- | :-------------------------------------------------------------- |
| `mountPath` | `string` | Path to management interface. _Optional_, defaults to `/posts`. |

## Pre-filling the form

The create form accepts query parameters to pre-fill fields, so a bookmarklet or a reader’s post button can hand over what it has. Anything already in the form remains untouched.

| Parameter | Description                                                                                                                   |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `type`    | Post type to create, for example `bookmark` or `note`.                                                                        |
| `url`     | Goes to the post type's URL field (`bookmark-of`, `in-reply-to`, `like-of` or `repost-of`), or to its content if it has none. |
| `name`    | Title of the post (where the post type has a name field).                                                                     |

For example, `/posts/create?type=bookmark&url=https://example.website/article&name=An+article`.
