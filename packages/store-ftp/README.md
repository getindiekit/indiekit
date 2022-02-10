# @indiekit/store-ftp

Store IndieWeb content via FTP.

## Installation

`npm i @indiekit/store-ftp`

## Usage

Add `@indiekit/store-ftp` to your list of plugins, specifying options as required:

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
| `user`      | `string` | Your FTP username. _Required_, defaults to `process.env.FTP_USER`.     |
| `password`  | `string` | Your FTP password. _Required_, defaults to `process.env.FTP_PASSWORD`. |
| `directory` | `string` | Directory to save files to. _Optional_.                                |
