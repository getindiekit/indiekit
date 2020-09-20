import got from 'got';
import validator from 'express-validator';

const {validationResult} = validator;

export const shareController = publication => ({
  get: (request, response) => {
    const {content, name, url, success} = request.query;

    response.render('share', {
      title: response.__('share.title'),
      content,
      name,
      url,
      success,
      minimalui: (request.params.path === 'bookmarklet')
    });
  },

  post: async (request, response, next) => {
    const {content, name} = request.body;
    const bookmarkOf = request.body.url || request.body['bookmark-of'];
    const host = `${request.protocol}://${request.headers.host}`;
    const path = publication.micropubEndpoint;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render('share', {
        title: response.__('share.title'),
        name,
        content,
        'bookmark-of': bookmarkOf,
        errors: errors.mapped(),
        minimalui: (request.params.path === 'bookmarklet')
      });
    }

    try {
      const endpointResponse = await got.post(`${host}${path}`, {
        form: request.body,
        responseType: 'json'
      });

      const success = endpointResponse.body;
      if (success) {
        const message = encodeURIComponent(success.success_description);
        response.redirect(`?success=${message}`);
      }
    } catch (error) {
      if (error.response) {
        response.status(422).render('share', {
          title: response.__('share.title'),
          content,
          name,
          bookmarkOf,
          error: error.response.body.error_description,
          minimalui: (request.params.path === 'bookmarklet')
        });
      } else {
        next(error);
      }
    }
  }
});
