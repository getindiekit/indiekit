# @indiekit/syndicator-internet-archive

[Internet Archive](https://archive.org) syndicator for Indiekit.

## Installation

`npm install @indiekit/syndicator-internet-archive`

## Requirements

A pair of [Internet Archive API access and secret keys](https://archive.org/account/s3.php).

> [!IMPORTANT]
> Store your API access and secret keys in environment variables called `INTERNET_ARCHIVE_ACCESS_KEY` and `INTERNET_ARCHIVE_SECRET_KEY` so that only you and the application can see them.

## Usage

Add `@indiekit/syndicator-internet-archive` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/syndicator-internet-archive"],
  "@indiekit/syndicator-internet-archive": {
    "checked": true
  }
}
```

## Options

| Option      | Type      | Description                                                                                                                                                          |
| :---------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessKey` | `string`  | Your S3 access key. _Required_, defaults to `process.env.INTERNET_ARCHIVE_ACCESS_KEY`.                                                                               |
| `secretKey` | `string`  | Your S3 secret key. _Required_, defaults to `process.env.INTERNET_ARCHIVE_SECRET_KEY`.                                                                               |
| `checked`   | `boolean` | Tell a Micropub client whether this syndicator should be enabled by default. _Optional_, defaults to `false`.                                                        |
| `uid`       | `string`  | Value Micropub client will include when publishing a post to indicate that it should be sent to this syndicator. _Optional_, defaults to `https://web.archive.org/`. |
