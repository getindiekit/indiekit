const express = require('express');
const {expires, port} = require('./config/server');
const fileCacheService = require('./services/file-cache');

const app = express();

app.get('/file-cache', async (request, response) => {
  const json = await fileCacheService('file', request.query.url, expires);
  return response.json(json);
});

app.listen(port, () => {
  console.log('Server listening on port:', port);
});
