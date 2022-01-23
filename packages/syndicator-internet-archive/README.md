# @indiekit/syndicator-internet-archive

Syndicate IndieWeb content to the Internet Archive.

## Installation

`npm i @indiekit/syndicator-internet-archive`

## Requirements

A set of Internet Archive API keys. You can get these from <https://archive.org/account/s3.php>.

## Usage

Add `@indiekit/syndicator-internet-archive` to your list of plugins, specifying options as required:

```json
{
  "plugins": [
    "@indiekit/syndicator-internet-archive"
  ],
  "@indiekit/syndicator-internet-archive": {
    "checked": true,
    "forced": true
  }
}
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `accessKey` | `string` | Your S3 access key. *Required*, defaults to `process.env.INTERNET_ARCHIVE_ACCESS_KEY`. |
| `secretKey` | `string` | Your S3 secret key. *Required*, defaults to `process.env.INTERNET_ARCHIVE_SECRET_KEY`. |
| `checked` | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. *Optional*, defaults to `false`. |
| `forced` | `boolean` | Ignore the presence or value of `checked` and always syndicate. *Optional*. |
| `name` | `string` | Name for this syndicator that may appear in a Micropub client’s publishing interface. *Optional*, defaults to `Internet Archive`. |
| `uid` | `string` | Value Micropub client will include when publishing a post to indicate that it should be sent to this syndicator. *Optional*, defaults to `https://web.archive.org/`. |
