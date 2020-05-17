import express from 'express';
import {expires, port} from './config/server.js';
import fileCacheService from './services/file-cache.js';

const app = express();

app.get('/file-cache', async (request, response) => {
  const json = await fileCacheService('file', request.query.url, expires);
  return response.json(json);
});

app.listen(port, () => {
  console.log('Server listening on port:', port);
});
