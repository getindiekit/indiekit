import express from 'express';
import {styles, templates} from '../../frontend/index.js';
import httpError from 'http-errors';

import {read as settings} from '../controllers/settings.js';

import {router as docsRoute} from './docs.js';
import {router as micropubRoute} from './micropub.js';
import {router as settingsRoute} from './settings.js';

export const app = express();

// Views
app.engine('njk', templates(app).render);
app.set('view engine', 'njk');
app.use(async (request, response, next) => {
  const url = `${request.protocol}://${request.headers.host}`;
  response.locals.app = await settings;
  response.locals.app.url = url;
  response.locals.app.cssPath = `${url}/app.css`;
  next();
});

// Styles
app.use('/app.css', async (request, response, next) => {
  const css = await styles;
  return response.type('text/css').send(css).end();
});

// Routes
app.use('/docs', docsRoute);
app.use('/micropub', micropubRoute);
app.use('/settings', settingsRoute);

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
