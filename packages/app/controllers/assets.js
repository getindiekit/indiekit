import {styles} from '@indiekit/frontend';

export default router => {
  router.use('/assets/app.css', async (request, response) => {
    const css = await styles;
    return response.type('text/css').send(css).end();
  });
};
