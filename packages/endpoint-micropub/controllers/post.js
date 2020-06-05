import derivePostType from 'post-type-discovery';
import httpError from 'http-errors';
import {formEncodedToMf2} from '../services/transform-request.js';
import {prepareContent} from '../services/prepare-content.js';

export const createPost = async (request, response, next) => {
  const {config} = response.locals.publication;

  try {
    const {body} = request;

    // Get Microformats
    const mf2 = request.is('json') ? body : formEncodedToMf2(body);

    // Derive post type
    const postType = derivePostType(mf2);

    // TODO: Derive properties
    const {properties} = mf2;

    // Prepare content
    const templatePath = config['post-types'][postType].template;
    const content = await prepareContent(properties, templatePath);

    // TODO: Record action in post store

    // TODO: Post content to content host
    return response.send(content);
  } catch (error) {
    return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
  }
};
