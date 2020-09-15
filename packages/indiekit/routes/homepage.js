import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (request, response) => {
  if (request.session.token) {
    response.redirect('/status');
  }

  response.redirect('/session/login');
});

export const homepageRoutes = router;
