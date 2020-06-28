import got from 'got';

export const shareController = publication => ({
  edit: (request, response) => {
    const {content, name, url, success} = request.query;

    response.render('share', {
      title: 'Share',
      content,
      name,
      url,
      success,
      minimalui: (request.params.path === 'bookmarklet')
    });
  },

  save: async (request, response, next) => {
    const host = `${request.protocol}://${request.headers.host}`;
    const path = publication['micropub-endpoint'];

    try {
      const micropubPost = await got.post(`${host}${path}`, {
        form: request.body,
        responseType: 'json'
      });

      const success = micropubPost.body;
      if (success) {
        const message = encodeURIComponent(success.description);
        response.redirect(`?success=${message}`);
      }
    } catch (error) {
      // TODO: Fix race condition. Reponse throws an error to next but so does internal endpoint
      next(error);
    }
  }
});
