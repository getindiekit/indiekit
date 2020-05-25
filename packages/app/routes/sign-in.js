export default router => {
  router.get('/sign-in', (request, response) => {
    response.render('sign-in', {
      title: 'Sign in',
      referrer: request.query.referrer
    });
  });
};
