# @indiekit/endpoint-auth

IndieAuth authentication and authorization endpoint for Indiekit. Grants and verifies access tokens and authenticates users.

## Installation

`npm install @indiekit/endpoint-auth`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

Add `@indiekit/endpoint-auth` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-auth"],
  "@indiekit/endpoint-auth": {
    "mountPath": "/authorize",
  },
}
```

You will also need to set the following environment variables:

- `SECRET` - used to sign and verify tokens and salt password
- `PASSWORD_SECRET` - hashed and salted password used when signing in. You can generate this value by visiting `/auth/new-password`

## Options

| Option      | Type     | Description                                                      |
| :---------- | :------- | :--------------------------------------------------------------- |
| `mountPath` | `string` | Path to authorization endpoint. _Optional_, defaults to `/auth`. |
