export default router => {
  router.get('/', async (request, response) => {
    response.render('homepage', {
      title: 'Status'
    });
  });
};
