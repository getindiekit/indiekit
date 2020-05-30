import IndieAuth from 'indieauth-helper';
import normalizeUrl from 'normalize-url';
import validator from 'express-validator';
import errorList from '../services/error-list.js';

const auth = new IndieAuth({secret: 'secret'});
const {validationResult} = validator;

export const login = (request, response) => {
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
    const me = normalizeUrl(request.body.me);
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
