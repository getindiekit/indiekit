# @indiekit/endpoint-files

File management endpoint for Indiekit. View files uploaded to your media endpoint and upload new files to it.

## Installation

`npm install @indiekit/endpoint-files`

> [!NOTE]
> This package is installed alongside `@indiekit/indiekit`

## Usage

Add `@indiekit/endpoint-files` to your list of plug-ins, specifying options as required:

```jsonc
{
  "plugins": ["@indiekit/endpoint-files"],
  "@indiekit/endpoint-files": {
    "mountPath": "/dossiers", // fr-FR
  },
}
```

## Options

| Option      | Type     | Description                                                     |
| :---------- | :------- | :-------------------------------------------------------------- |
| `mountPath` | `string` | Path to management interface. _Optional_, defaults to `/files`. |
