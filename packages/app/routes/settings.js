import express from 'express';
import * as applicationController from '../controllers/application.js';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response) => {
  response.render('settings/index', {
    title: 'Settings',
    app: await applicationController.read()
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
  await applicationController.write(request.body);
  response.cookie('locale', request.body.locale, {
    maxAge: 900000
  });
  response.redirect(request.query.referrer || '/settings/');
});

router.get('/publication', (request, response) => {
  response.render('settings/publication', {
    parent: 'Settings',
    title: 'Publication',
    referrer: request.query.referrer
  });
});

router.post('/publication', async (request, response) => {
  await applicationController.write(request.body);
  response.redirect(request.query.referrer || '/settings/');
});
