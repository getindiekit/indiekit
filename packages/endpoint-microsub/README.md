# @indiekit/endpoint-microsub

Microsub endpoint for Indiekit. Lets a Microsub client, such as a social reader, manage channels and read their timelines.

## Installation

`npm install @indiekit/endpoint-microsub`

## Usage

Add `@indiekit/endpoint-microsub` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/endpoint-microsub"],
  "@indiekit/endpoint-microsub": {
    "mountPath": "/reader"
  }
}
```

## Options

| Option      | Type     | Description                                                               |
| :---------- | :------- | :------------------------------------------------------------------------ |
| `mountPath` | `string` | Path to listen to Microsub requests. _Optional_, defaults to `/microsub`. |

## Supported actions

- Channels: `/microsub?action=channels` lists them; `POST` with `method` set to `create`, `update`, `delete` or `order` changes them.
- Timeline: `/microsub?action=timeline&channel=UID` lists a channel's items, newest first, paged with `after` and `before`; `POST` with `method` set to `mark_read`, `mark_unread` or `remove` changes them.

Following, muting, blocking, search and preview are not supported yet.

This endpoint requires a database.
