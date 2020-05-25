import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';
import {templates} from '@indiekit/frontend';
import localDataMiddleware from './middleware/local-data.js';
import controllers from './controllers/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Parse application/json
app.use(express.json({
  limit: '10mb'
}));

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Views
app.set('views', path.join(`${__dirname}`, 'views'));
app.engine('njk', templates(app).render);
app.set('view engine', 'njk');
app.use(localDataMiddleware);

// Controllers
app.use(controllers);

// Handle errors
app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
  const status = error.status || 500;

  return response.status(status).type('txt').send(error);
});

export default app;
