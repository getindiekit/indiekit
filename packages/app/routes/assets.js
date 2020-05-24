import express from 'express';
import {styles} from '@indiekit/frontend';

export const router = express.Router(); // eslint-disable-line new-cap

router.use('/app.css', async (request, response) => {
  const css = await styles;
  return response.type('text/css').send(css).end();
});
