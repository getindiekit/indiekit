# @indiekit/endpoint-activitypub

ActivityPub endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-activitypub`

## Usage

Add `@indiekit/endpoint-activitypub` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/endpoint-activitypub"],
  "@indiekit/endpoint-activitypub": {
    "mountPath": "/activities"
  }
}
```

## Options

| Option        | Type     | Description                                                                     |
| :------------ | :------- | :------------------------------------------------------------------------------ |
| `domain`      | `string` | _Required_.                                                                     |
| `mountPath`   | `string` | Path to listen to ActivityPub requests. _Optional_, defaults to `/activitypub`. |
| `username`    | `string` | _Required_.                                                                     |
| `displayName` | `string` | _Optional_.                                                                     |
| `summary`     | `string` | _Optional_.                                                                     |
| `icon`        | `string` | _Optional_.                                                                     |
