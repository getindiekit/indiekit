import * as publicationController from '../controllers/publication.js';

export default router => {
  router.get('/', async (request, response) => {
    const config = await publicationController.queryConfig();
    response.render('homepage', {
      title: 'Status',
      config
    });
  });
};
