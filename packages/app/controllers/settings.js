import validator from 'express-validator';
import errorList from '../services/error-list.js';
import * as applicationModel from '../models/application.js';
import * as publicationModel from '../models/publication.js';
import * as githubModel from '../models/github.js';
import * as gitlabModel from '../models/gitlab.js';

const {validationResult} = validator;

// Settings overview
export const viewAll = async (request, response) => {
  response.render('settings/index', {
    title: 'Settings'
  });
};

// Application settings
export const editApplication = (request, response) => {
  response.render('settings/application', {
    parent: 'Settings',
    title: 'Application',
    referrer: request.query.referrer
  });
};

export const saveApplication = async (request, response) => {
  await applicationModel.setAll(request.body);
  response.cookie('locale', request.body.locale, {
    maxAge: 900000
  });
  response.redirect(request.query.referrer || '/settings');
};

// Publication settings
export const editPublication = (request, response) => {
  response.render('settings/publication', {
    parent: 'Settings',
    title: 'Publication',
    referrer: request.query.referrer
  });
};

export const savePublication = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('settings/publication', {
      parent: 'Settings',
      title: 'Publication',
      errors: errors.mapped(),
      errorList: errorList(errors)
    });
  }

  await publicationModel.setAll(request.body);
  response.redirect(request.query.referrer || '/settings');
};

// Content host settings (GitHub/GitLab)
export const editHost = (request, response) => {
  const {hostId} = request.params;

  response.render(`settings/${hostId}`, {
    parent: 'Settings',
    title: hostId,
    referrer: request.query.referrer
  });
};

export const saveGithub = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('settings/github', {
      parent: 'Settings',
      title: 'github',
      errors: errors.mapped(),
      errorList: errorList(errors)
    });
  }

  await githubModel.setAll(request.body);
  response.redirect(request.query.referrer || '/settings');
};

export const saveGitlab = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('settings/gitlab', {
      parent: 'Settings',
      title: 'gitlab',
      errors: errors.mapped(),
      errorList: errorList(errors)
    });
  }

  await gitlabModel.setAll(request.body);
  response.redirect(request.query.referrer || '/settings');
};
