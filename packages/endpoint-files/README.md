# @indiekit/endpoint-files

File management endpoint for Indiekit. View files uploaded to your media endpoint and upload new files to it.

## Installation

`npm install @indiekit/endpoint-files`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

To customise the behaviour of this plug-in, add `@indiekit/endpoint-files` to your configuration, specifying options as required:

```jsonc
{
  "@indiekit/endpoint-files": {
    "mountPath": "/dossiers", // fr-FR
  },
}
```

## Options

| Option      | Type     | Description                                                     |
| :---------- | :------- | :-------------------------------------------------------------- |
| `mountPath` | `string` | Path to management interface. _Optional_, defaults to `/files`. |
