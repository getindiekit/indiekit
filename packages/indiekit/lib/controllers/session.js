import httpError from 'http-errors';
import IndieAuth from 'indieauth-helper';
import normalizeUrl from 'normalize-url';
import {v4 as uuidv4} from 'uuid';

const auth = new IndieAuth({
  secret: uuidv4()
});

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
    title: response.__('session.login.title'),
    referrer: request.query.referrer
  });
};

export const authenticate = async (request, response) => {
  try {
    const me = normalizeUrl(response.locals.publication.me, {
      removeTrailingSlash: false
    });
    auth.options.me = new URL(me).href;
    const authUrl = await auth.getAuthUrl('code', ['create', 'update', 'delete']);

    response.redirect(authUrl);
  } catch (error) {
    response.status(401).render('session/login', {
      title: response.__('session.login.title'),
      error: error.message
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
        error: response.__('session.login.error.validateRedirect')
      });
    }
  }

  if (!code || !state || !auth.validateState(state)) {
    return response.status(403).render('session/login', {
      title: response.__('session.login.title'),
      error: response.__('session.login.error.validateState')
    });
  }

  try {
    const token = await auth.getToken(code);
    request.session.token = token;
    response.redirect(redirect || '/');
  } catch (error) {
    next(httpError(400, error));
  }
};

export const logout = (request, response) => {
  request.session = null;
  response.redirect('/');
};
