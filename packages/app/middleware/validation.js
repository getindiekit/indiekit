import validator from 'express-validator';
import validateUrlService from '../services/validate-url.js';

const {check} = validator;

export const me = [
  check('me')
    .isURL({force_protocol: true}) // eslint-disable-line camelcase
    .withMessage('Enter a web address with a complete URL, like https://example.org')
];

export const publicationSettings = [
  check('customConfigUrl')
    .optional({checkFalsy: true})
    .custom(async url => validateUrlService(url, 'json'))
];

export const githubSettings = [
  check('user')
    .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
    .withMessage('Username must be between 1 and 38 characters long.'),
  check('repo')
    .matches(/^[\w-]+$/i)
    .withMessage('Repository name must only include letters, numbers and hyphens.'),
  check('token')
    .matches(/^[a-f\d]{40}$/i)
    .withMessage('Personal access token must be an alphanumeric value that is 40 characters long.')
];

export const gitlabSettings = [
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
];
