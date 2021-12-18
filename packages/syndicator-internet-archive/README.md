# @indiekit/syndicator-internet-archive

Syndicate IndieWeb content to the Internet Archive.

## Installation

`npm i @indiekit/syndicator-internet-archive`

## Usage

```js
const InternetArchiveSyndicator = require('@indiekit/syndicator-internet-archive');

const internetArchive = new InternetArchiveSyndicator({
  // Options
});
```

## Options

You can get your Internet Archive API keys from <https://archive.org/account/s3.php>.

| Option | Type | Description |
| :----- | :--- | :---------- |
| `accessKey` | `string` | Your S3 access key. *Required* |
| `secret` | `string` | Your S3 secret key. *Required* |
| `name` | `string` | Name for this syndicator that may appear in a Micropub client’s publishing interface. *Optional*, defaults to `Internet Archive` |
| `uid` | `string` | Value Micropub client will include when publishing a post to indicate that it should be sent to this syndicator. *Optional*, defaults to `https://web.archive.org/` |
| `checked` | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. *Optional*, defaults to `false` |
