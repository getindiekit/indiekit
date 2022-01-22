# @indiekit/store-ftp

Store IndieWeb content via FTP.

## Installation

`npm i @indiekit/store-ftp`

## Usage

```js
const FtpStore = require('@indiekit/store-ftp');

const ftp = new FtpStore({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `host` | `string` | Your FTP hostname, for example ftp.server.example. *Required*. |
| `user` | `string` | Your FTP username. *Required*, defaults to `process.env.FTP_USER`. |
| `password` | `string` | Your FTP password. *Required*, defaults to `process.env.FTP_PASSWORD`. |
| `directory` | `string` | Directory to save files to. *Optional*. |
