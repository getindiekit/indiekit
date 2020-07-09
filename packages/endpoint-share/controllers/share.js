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
    const {content, name, url} = request.body;
    const host = `${request.protocol}://${request.headers.host}`;
    const path = publication['micropub-endpoint'];

    try {
      const endpointResponse = await got.post(`${host}${path}`, {
        form: request.body,
        responseType: 'json'
      });

      const success = endpointResponse.body;
      if (success) {
        const message = encodeURIComponent(success.description);
        response.redirect(`?success=${message}`);
      }
    } catch (error) {
      if (error.response) {
        const {response} = error;
        response.render('share', {
          title: 'Share',
          content,
          name,
          url,
          error: response.body,
          minimalui: (request.params.path === 'bookmarklet')
        });
      } else {
        next(error);
      }
    }
  }
});
