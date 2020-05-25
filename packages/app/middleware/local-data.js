import * as applicationController from '../controllers/application.js';
import * as publicationController from '../controllers/publication.js';

export default async (request, response, next) => {
  const url = `${request.protocol}://${request.headers.host}`;
  response.locals.url = url;
  response.locals.cssPath = `${url}/assets/app.css`;

  try {
    response.locals.application = await applicationController.read();
    response.locals.publication = await publicationController.read();
  } catch (error) {
    /* c8 ignore next 2 */
    return next(error);
  }

  next();
};
