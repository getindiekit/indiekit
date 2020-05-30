export default router => {
  router.get('/session/login', (request, response) => {
    response.render('session/login', {
      title: 'Sign in',
      referrer: request.query.referrer
    });
  });
};
