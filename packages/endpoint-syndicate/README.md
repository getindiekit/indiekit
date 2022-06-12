# @indiekit/endpoint-syndicate

Syndication endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-syndicate`

## Usage

Add `@indiekit/endpoint-syndicate` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-syndicate"],
  "@indiekit/endpoint-syndicate": {
    "mountPath": "/syndikat" // de-DE
  }
}
```

## Options

| Option      | Type     | Description                                                         |
| :---------- | :------- | :------------------------------------------------------------------ |
| `mountPath` | `string` | Path to syndication endpoint. _Optional_, defaults to `/syndicate`. |

## Supported endpoint queries

- Access token (required): `/syndicate?token=XXXXXXX`
- URL to syndicate: `/syndicate?token=XXXXXXX&url=https%3A%2F%2Fwebsite.example%2Fposts%2F1`
