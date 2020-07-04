import httpError from 'http-errors';
import IndieAuth from 'indieauth-helper';
import normalizeUrl from 'normalize-url';
import validator from 'express-validator';
import {defaultConfig} from '../config/defaults.js';

const auth = new IndieAuth({
  // TODO: Use resolved server config
  secret: defaultConfig.server.secret
});
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
      errors: errors.mapped()
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
  const {code, redirect, state} = request.query;

  if (!code || !state || !auth.validateState(state)) {
    return response.status(403).render('session/login', {
      title: 'Sign in',
      error: 'Missing code or state mismatch'
    });
  }

  try {
    const token = await auth.getToken(code);
    request.session.token = token;

    response.redirect(redirect || '/');
  } catch (error) {
    return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
  }
};

export const logout = (request, response) => {
  request.session = null;
  response.redirect('/');
};
