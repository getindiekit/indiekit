import validator from 'express-validator';
import validateUrlService from '../services/validate-url.js';
import errorList from '../services/error-list.js';
import * as applicationController from '../controllers/application.js';
import * as publicationController from '../controllers/publication.js';
import * as githubController from '../controllers/github.js';
import * as gitlabController from '../controllers/gitlab.js';

const {check, validationResult} = validator;

export default router => {
  // Settings overview
  router.get('/settings', async (request, response) => {
    response.render('settings/index', {
      title: 'Settings',
      app: await applicationController.read()
    });
  });

  // Application settings
  router.get('/settings/application', (request, response) => {
    response.render('settings/application', {
      parent: 'Settings',
      title: 'Application',
      referrer: request.query.referrer
    });
  });

  router.post('/settings/application', async (request, response) => {
    await applicationController.write(request.body);
    response.cookie('locale', request.body.locale, {
      maxAge: 900000
    });
    response.redirect(request.query.referrer || '/settings');
  });

  // Publication settings
  router.get('/settings/publication', (request, response) => {
    response.render('settings/publication', {
      parent: 'Settings',
      title: 'Publication',
      referrer: request.query.referrer
    });
  });

  router.post('/settings/publication', [
    check('customConfigUrl')
      .optional({checkFalsy: true})
      .custom(async url => validateUrlService(url, 'json'))
  ], async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).render('settings/publication', {
        parent: 'Settings',
        title: 'Publication',
        errors: errors.mapped(),
        errorList: errorList(errors)
      });
    }

    await publicationController.write(request.body);
    response.redirect(request.query.referrer || '/settings');
  });

  // Content host settings (GitHub/GitLab)
  router.get('/settings/:hostId(github|gitlab)', (request, response) => {
    const {hostId} = request.params;

    response.render(`settings/${hostId}`, {
      parent: 'Settings',
      title: hostId,
      referrer: request.query.referrer
    });
  });

  router.post('/settings/github', [
    check('user')
      .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
      .withMessage('Username must be between 1 and 38 characters long.'),
    check('repo')
      .matches(/^[\w-]+$/i)
      .withMessage('Repository name must only include letters, numbers and hyphens.'),
    check('token')
      .matches(/^[a-f\d]{40}$/i)
      .withMessage('Personal access token must be an alphanumeric value that is 40 characters long.')
  ], async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).render('settings/github', {
        parent: 'Settings',
        title: 'github',
        errors: errors.mapped(),
        errorList: errorList(errors)
      });
    }

    await githubController.write(request.body);
    response.redirect(request.query.referrer || '/settings');
  });

  router.post('/settings/gitlab', [
    check('instance')
      .isURL({require_protocol: true}) // eslint-disable-line camelcase
      .withMessage('Instance must be a URL'),
    check('user')
      .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
      .withMessage('Username must be between 1 and 38 characters long.'),
    check('repo')
      .matches(/^[\w-]+$/i)
      .withMessage('Project name must only include letters, numbers and hyphens.'),
    check('token')
      .matches(/^[a-z\d]{20}$/i)
      .withMessage('Personal access token must be an alphanumeric value that is 20 characters long')
  ], async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).render('settings/gitlab', {
        parent: 'Settings',
        title: 'gitlab',
        errors: errors.mapped(),
        errorList: errorList(errors)
      });
    }

    await gitlabController.write(request.body);
    response.redirect(request.query.referrer || '/settings');
  });
};
