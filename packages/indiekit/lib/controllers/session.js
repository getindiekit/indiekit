import Debug from 'debug';
import httpError from 'http-errors';
import {IndieAuth} from '../indieauth.js';
import {getCanonicalUrl} from '../utils.js';

const debug = new Debug('indiekit:session');

const auth = new IndieAuth();

export const login = (request, response) => {
  if (request.session.token) {
    return response.redirect('/');
  }

  const {url} = response.locals.application;
  auth.options.clientId = url;

  const callbackUrl = `${url}/session/auth`;
  const {redirect} = request.query;
  auth.options.redirectUri = redirect
    ? `${callbackUrl}?redirect=${redirect}`
    : `${callbackUrl}`;

  return response.render('session/login', {
    title: response.__('session.login.title'),
    referrer: request.query.referrer,
  });
};

export const authenticate = async (request, response) => {
  // TODO: Remove need for auth.options to be set in controller
  auth.options.clientId = response.locals.application.url;
  auth.options.me = getCanonicalUrl(response.locals.publication.me);

  try {
    const authUrl = await auth.getAuthUrl('create update delete');

    return response.redirect(authUrl);
  } catch (error) {
    debug(error);
    return response.status(401).render('session/login', {
      title: response.__('session.login.title'),
      error: error.message,
    });
  }
};

export const authenticationCallback = async (request, response, next) => {
  const {code, redirect, state} = request.query;

  if (redirect) {
    const validRedirect = redirect.match(/^\/[\w/]+$/);

    if (!validRedirect) {
      return response.status(403).render('session/login', {
        title: response.__('session.login.title'),
        error: response.__('session.login.error.validateRedirect'),
      });
    }
  }

  if (!code || !state || !auth.validateState(state)) {
    return response.status(403).render('session/login', {
      title: response.__('session.login.title'),
      error: response.__('session.login.error.validateState'),
    });
  }

  try {
    const token = await auth.authorizationCodeGrant(code);
    request.session.token = token;
    return response.redirect(redirect || '/');
  } catch (error) {
    debug(error);
    return next(httpError(400, error));
  }
};

export const logout = (request, response) => {
  request.session = null;
  return response.redirect('/');
};
