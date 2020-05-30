import validator from 'express-validator';
import errorList from '../services/error-list.js';

const {validationResult} = validator;

export const login = (request, response) => {
  response.render('session/login', {
    title: 'Sign in',
    referrer: request.query.referrer
  });
};

export const authenticate = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).render('session/login', {
      title: 'Sign in',
      errors: errors.mapped(),
      errorList: errorList(errors)
    });
  }

  response.redirect('/settings');
};
