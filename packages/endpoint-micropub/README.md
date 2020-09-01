# @indiekit/endpoint-micropub

Micropub endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-micropub`

## Configuration

```js
const MicropubEndpoint = require('@indiekit/endpoint-micropub');

const micropubEndpoint = new MicropubEndpoint({
  // config options here
});
```

### Options

* `mountpath`: Path to listen to Micropub requests. *Optional*, defaults to `/micropub`.
