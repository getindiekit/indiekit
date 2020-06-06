import httpError from 'http-errors';
import IndieAuth from 'indieauth-helper';
import normalizeUrl from 'normalize-url';
import validator from 'express-validator';
import {client} from '../config/database.js';
import {secret} from '../config/session.js';
import {errorList} from '../services/error-list.js';
import {PublicationModel} from '../models/publication.js';

const auth = new IndieAuth({secret});
const publicationModel = new PublicationModel(client);
const {validationResult} = validator;

export const login = (request, response) => {
  if (request.session.token) {
    return response.redirect('/');
  }

  const {url} = response.locals.application;
  const callbackUrl = `${url}/session/auth`;
  const {redirect} = request.query;

  const redirectUri = redirect ?
    `${callbackUrl}?redirect=${redirect}` :
    `${callbackUrl}`;

  auth.options.clientId = url;
  auth.options.redirectUri = redirectUri;

  response.render('session/login', {
    title: 'Sign in',
    referrer: request.query.referrer
  });
};

export const authenticate = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).render('session/login', {
      title: 'Sign in',
      errors: errors.mapped(),
      errorList: errorList(errors.mapped())
    });
  }

  try {
    const me = normalizeUrl(request.body.me, {
      removeTrailingSlash: false
    });
    auth.options.me = new URL(me).href;
    const authUrl = await auth.getAuthUrl('code', ['create']);

    response.redirect(authUrl);
  } catch (error) {
    response.status(401).render('session/login', {
      title: 'Sign in',
      error: error.message
    });
  }
};

export const authenticationCallback = async (request, response, next) => {
  const {code, me, redirect, state} = request.query;

  if (!code || !state || !auth.validateState(state)) {
    return response.status(403).render('session/login', {
      title: 'Sign in',
      error: 'Missing code or state mismatch'
    });
  }

  try {
    const token = await auth.getToken(code);
    request.session.token = token;

    await publicationModel.set('me', me);
    response.redirect(redirect || '/');
  } catch (error) {
    return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
  }
};

export const logout = (request, response) => {
  request.session.destroy();
  response.redirect('/');
};
