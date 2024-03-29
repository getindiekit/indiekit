# @indiekit/store-s3

S3-compatible content store adaptor for Indiekit.

## Installation

`npm i @indiekit/store-s3`

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
