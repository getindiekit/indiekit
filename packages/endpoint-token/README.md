# @indiekit/endpoint-token

Token endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-token`

## Usage

Add `@indiekit/endpoint-token` to your list of plugins, specifying options as required:

```json
{
  "plugins": ["@indiekit/endpoint-token"],
  "@indiekit/endpoint-token": {
    "mountPath": "/tokens"
  }
}
```

You will also need to set a `TOKEN_SECRET` environment variable to sign and verify tokens created by this endpoint.

## Options

| Option      | Type     | Description                                               |
| :---------- | :------- | :-------------------------------------------------------- |
| `mountPath` | `string` | Path to token endpoint. _Optional_, defaults to `/token`. |
