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

Name for this syndicator that may appear in a Micropub client’s publishing interface.

Type: `string`\
*Optional*, defaults to `Internet Archive`

### `checked`

Tell a Micropub client whether this syndicator should be enabled by default.

Type: `boolean`\
*Optional*, defaults to `false`

### `uid`

Value Micropub client will include when publishing a post to indicate that it should be sent to this syndicator.

Type: `string`\
*Optional*, defaults to `https://web.archive.org/`
