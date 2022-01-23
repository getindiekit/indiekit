# @indiekit/endpoint-syndicate

Syndication endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-syndicate`

## Usage

Add `@indiekit/endpoint-syndicate` to your list of plugins, specifying options as required:

```json
{
  "plugins": [
    "@indiekit/endpoint-syndicate"
  ],
  "@indiekit/endpoint-syndicate": {
    "mountPath": "/syndicator"
  }
}
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `mountPath` | `string` | Path to syndication endpoint. *Optional*, defaults to `/syndicate`. |
