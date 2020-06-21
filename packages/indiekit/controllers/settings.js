import validator from 'express-validator';
import {client} from '../config/database.js';
import {ApplicationModel} from '../models/application.js';
import {PublicationModel} from '../models/publication.js';
import {GithubModel} from '../models/github.js';
import {GitlabModel} from '../models/gitlab.js';

const {validationResult} = validator;
const applicationModel = new ApplicationModel(client);
const publicationModel = new PublicationModel(client);
const githubModel = new GithubModel(client);
const gitlabModel = new GitlabModel(client);

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
      errors: errors.mapped()
    });
  }

  await publicationModel.setAll(request.body);
  response.redirect(request.query.referrer || '/settings');
};

// Content store settings (GitHub/GitLab)
export const editStore = (request, response) => {
  const {storeId} = request.params;

  response.render(`settings/${storeId}`, {
    parent: 'Settings',
    title: storeId,
    referrer: request.query.referrer
  });
};

export const saveGithub = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).render('settings/github', {
      parent: 'Settings',
      title: 'github',
      errors: errors.mapped()
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
      errors: errors.mapped()
    });
  }

  await gitlabModel.setAll(request.body);
  response.redirect(request.query.referrer || '/settings');
};
