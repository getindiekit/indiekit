import got from 'got';

export const editShare = (request, response) => {
  const {content, name, url, success} = request.query;

  response.render('share', {
    title: 'Share',
    content,
    name,
    url,
    success,
    minimalui: (request.params.path === 'bookmarklet')
  });
};

export const saveShare = async (request, response, next) => {
  const {endpoints} = response.locals.application;
  const micropubEndpoint = endpoints.find(
    endpoint => endpoint.id === 'micropub'
  );
  const host = `${request.protocol}://${request.headers.host}`;
  const path = micropubEndpoint.mountpath;

  try {
    const postResponse = await got.post(`${host}${path}`, {
      form: request.body,
      responseType: 'json'
    });

    const success = postResponse.body;
    if (success) {
      const message = encodeURIComponent(success.description);
      response.redirect(`?success=${message}`);
    }
  } catch (error) {
    next(error);
  }
};
