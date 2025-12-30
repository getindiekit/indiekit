# @indiekit/store-s3

S3-compatible content store adaptor for Indiekit.

## Installation

`npm install @indiekit/store-s3`

## Requirements

A pair of S3-compatible API access and secret keys.

> [!IMPORTANT]
> Store your API access and secret keys in environment variables called `S3_ACCESS_KEY` and `S3_SECRET_KEY` so that only you and the application can see them.

## Usage

Add `@indiekit/store-s3` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-s3"],
  "@indiekit/store-s3": {
    "region": "us-west",
    "endpoint": "https://s3-example-us-west-1.amazonaws.com",
    "bucket": "website"
  }
}
```

## Options

| Option      | Type     | Description                                                              |
| :---------- | :------- | :----------------------------------------------------------------------- |
| `accessKey` | `string` | Your S3 access key. _Required_, defaults to `process.env.S3_ACCESS_KEY`. |
| `secretKey` | `string` | Your S3 secret key. _Required_, defaults to `process.env.S3_SECRET_KEY`. |
| `region`    | `string` | Your S3 region name, for example `"us-west"`. _Required_.                |
| `endpoint`  | `string` | Your S3 endpoint. _Required_.                                            |
| `bucket`    | `string` | Your S3 bucket name. _Required_.                                         |
| `acl`       | `string` | Access Control List (ACL) policy, defaults to `"public-read"`.           |
