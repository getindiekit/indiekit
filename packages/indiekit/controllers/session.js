import httpError from 'http-errors';
import IndieAuth from 'indieauth-helper';
import normalizeUrl from 'normalize-url';
import {v4 as uuidv4} from 'uuid';
import validator from 'express-validator';

const auth = new IndieAuth({
  secret: uuidv4()
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
    next(httpError(400, error.message, {
      json: {
        error: 'invalid_request',
        error_description: error.message
      }
    }));
  }
};

export const logout = (request, response) => {
  request.session = null;
  response.redirect('/');
};
