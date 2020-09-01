# @indiekit/endpoint-media

Micropub media endpoint for Indiekit.

## Installation

`npm i @indiekit/endpoint-media`

## Configuration

```js
const MediaEndpoint = require('@indiekit/endpoint-media');

const mediaEndpoint = new MediaEndpoint({
  // config options here
});
```

### Options

* `mountpath`: Path to listen to media upload requests. *Optional*, defaults to `/media`.
