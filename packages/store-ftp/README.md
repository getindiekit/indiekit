# @indiekit/store-ftp

Store IndieWeb content via FTP.

## Installation

`npm i @indiekit/store-ftp`

## Configuration

```js
const FtpStore = require('@indiekit/store-ftp');

const ftp = new FtpStore({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `host` | `string` | Your FTP hostname, for example ftp.server.example. *Required* |
| `directory` | `string` | Directory to save files to. *Optional* |
| `user` | `string` | Your FTP username. *Required* |
| `password` | `string` | Your FTP password. *Required* |
