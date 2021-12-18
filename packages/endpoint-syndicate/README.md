# @indiekit/endpoint-syndicate

Syndication endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-syndicate`

## Configuration

```js
const SyndicateEndpoint = require('@indiekit/endpoint-syndicate');

const syndicateEndpoint = new SyndicateEndpoint({
  // Options
});
```

## Options

| Option | Type | Description |
| :----- | :--- | :---------- |
| `mountpath` | `string` | Path to syndication endpoint. *Optional*, defaults to `/syndicate` |
