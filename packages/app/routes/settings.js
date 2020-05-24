import express from 'express';
import * as settings from '../controllers/settings.js';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response) => {
  response.render('settings/index', {
    title: 'Settings',
    app: await settings.read()
  });
});

router.get('/application', (request, response) => {
  response.render('settings/application', {
    parent: 'Settings',
    title: 'Application',
    referrer: request.query.referrer
  });
});

router.post('/application', async (request, response) => {
  await settings.write(request.body);
  response.cookie('locale', request.body.locale, {
    maxAge: 900000
  });
  response.redirect(request.query.referrer || '/settings/');
});
