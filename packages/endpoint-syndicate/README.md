# @indiekit/endpoint-syndicate

Syndication endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-syndicate`

## Usage

```js
const SyndicateEndpoint = require('@indiekit/endpoint-syndicate');

const syndicateEndpoint = new SyndicateEndpoint({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `mountPath` | `string` | Path to syndication endpoint. *Optional*, defaults to `/syndicate`. |
