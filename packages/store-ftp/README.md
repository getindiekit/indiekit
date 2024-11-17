# @indiekit/store-ftp

FTP content store adaptor for Indiekit.

## Installation

`npm install @indiekit/store-ftp`

## Usage

Add `@indiekit/store-ftp` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-ftp"],
  "@indiekit/store-ftp": {
    "host": "ftp.server.example",
    "user": "username",
    "directory": "project/www"
  }
}
```

## Options

| Option      | Type     | Description                                                            |
| :---------- | :------- | :--------------------------------------------------------------------- |
| `host`      | `string` | Your FTP hostname, for example ftp.server.example. _Required_.         |
| `port`      | `number` | Your FTP port. _Optional_, defaults to `22`.                           |
| `user`      | `string` | Your FTP username. _Required_, defaults to `process.env.FTP_USER`.     |
| `password`  | `string` | Your FTP password. _Required_, defaults to `process.env.FTP_PASSWORD`. |
| `directory` | `string` | Directory to save files to. _Optional_.                                |
