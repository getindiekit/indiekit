import express from 'express';
import {app as routes} from './routes/index.js';

const app = express();

// Routes
app.use('/', routes);

// Handle errors
app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
  const status = error.status || 500;

  return response.status(status).type('txt').send(error);
});

export default app;
