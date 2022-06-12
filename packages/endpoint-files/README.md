# @indiekit/endpoint-files

File management endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-files`

## Usage

Add `@indiekit/endpoint-files` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/endpoint-files"],
  "@indiekit/endpoint-files": {
    "mountPath": "/dossiers"
  }
}
```

## Options

| Option      | Type     | Description                                                     |
| :---------- | :------- | :-------------------------------------------------------------- |
| `mountPath` | `string` | Path to management interface. _Optional_, defaults to `/files`. |
