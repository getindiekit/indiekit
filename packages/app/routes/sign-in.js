import express from 'express';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (request, response) => {
  response.render('sign-in', {
    title: 'Sign in',
    referrer: request.query.referrer
  });
});
