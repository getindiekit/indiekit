import got from 'got';

export const postsController = mountpath => ({
  view: async (request, response, next) => {
    const host = `${request.protocol}://${request.headers.host}`;
    const path = `${mountpath}?q=source`;

    try {
      const micropubQuery = await got(`${host}${path}`, {
        responseType: 'json'
      });

      const success = micropubQuery.body;
      if (success) {
        response.render('posts', {
          title: 'Posts',
          posts: success.items
        });
      }
    } catch (error) {
      next(error);
    }
  }
});
