import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';
import httpError from 'http-errors';
import {templates} from '@indiekit/frontend';
import localDataMiddleware from './middleware/local-data.js';
import * as routes from './routes/index.js';

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

// Routes
app.use('/assets', routes.assetsRoute);
app.use('/docs', routes.documentationRoute);
app.use('/micropub', routes.micropubRoute);
app.use('/settings', routes.settingsRoute);

// 404
app.use((request, response, next) => {
  const error = httpError.NotFound('Resource not found'); // eslint-disable-line new-cap
  response.status(error.status);

  if (request.accepts('html')) {
    response.render('document', {
      title: 'Page not found',
      content: 'If you entered a web address please check it was correct.'
    });
  } else {
    return next(error);
  }
});

// Handle errors
app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
  const status = error.status || 500;

  return response.status(status).type('txt').send(error);
});

export default app;
