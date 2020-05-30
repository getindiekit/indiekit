export default router => {
  router.get('/login', (request, response) => {
    response.render('login', {
      title: 'Sign in',
      referrer: request.query.referrer
    });
  });
};
