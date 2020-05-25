import express from 'express';
import validator from 'express-validator';
import validateUrlService from '../services/validate-url.js';
import errorList from '../services/error-list.js';
import * as applicationController from '../controllers/application.js';
import * as publicationController from '../controllers/publication.js';

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

router.post('/publication', [
  validator
    .check('customConfigUrl')
    .custom(async url => validateUrlService(url, 'json'))
], async (request, response) => {
  const errors = validator.validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('settings/publication', {
      parent: 'Settings',
      title: 'Publication',
      errors: errors.mapped(),
      errorList: errorList(errors)
    });
  }

  await publicationController.write(request.body);
  response.redirect(request.query.referrer || '/settings/');
});
