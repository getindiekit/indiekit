# @indiekit/syndicator-internet-archive

Syndicate IndieWeb content to the Internet Archive.

## Installation

`npm i @indiekit/syndicator-internet-archive`

## Usage

```js
const InternetArchiveSyndicator = require('@indiekit/syndicator-internet-archive');

const internetArchive = new InternetArchiveSyndicator({
  // config options here
});
```

## Options

You can get your Internet Archive API keys from <https://archive.org/account/s3.php>.

### `accessKey`

Your S3 access key.

Type: `string`\
*Required*

### `secret`

Your S3 secret key.

Type: `string`\
*Required*

### `name`

Type: `string`\
*Optional*, defaults to `archive.org`

### `uid`

Type: `string`\
*Optional*, defaults to `https://archive.org/`
