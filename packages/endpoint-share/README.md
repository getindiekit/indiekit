# @indiekit/endpoint-share

Share endpoint for Indiekit. Inspired and developed from [an idea described by Max Böck](https://mxb.dev/blog/indieweb-link-sharing/).

## Installation

`npm i @indiekit/endpoint-share`

## Usage

```js
const ShareEndpoint = require('@indiekit/endpoint-share');

const shareEndpoint = new ShareEndpoint({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `mountPath` | `string` | Path to share screen. *Optional*, defaults to `/share`. |
