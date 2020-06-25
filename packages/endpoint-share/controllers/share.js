import got from 'got';

export const shareController = application => ({
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
    const {endpoints} = application;
    const micropubEndpoint = endpoints.find(
      endpoint => endpoint.id === 'micropub'
    );
    const host = `${request.protocol}://${request.headers.host}`;
    const path = micropubEndpoint.mountpath;

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
      next(error);
    }
  }
});
