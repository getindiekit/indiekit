import derivePostType from 'post-type-discovery';
import httpError from 'http-errors';
import {templates} from '../lib/nunjucks.js';
import {deriveContent, derivePermalink, derivePublishedDate, deriveSlug} from '../services/properties.js';
import {formEncodedToMf2} from '../services/transform-request.js';

export const createPost = async (request, response, next) => {
  const {config, me} = response.locals.publication;

  try {
    const {body} = request;

    // Get Microformats
    const mf2 = request.is('json') ? body : formEncodedToMf2(body);

    // Derive post type and post type config
    const postType = derivePostType(mf2);
    const postTypeConfig = config['post-types'].find(
      type => type.type === postType
    );

    // Derive properties
    const {properties} = mf2;
    properties.content = deriveContent(mf2);
    // TODO: Use publication locale and timezone
    properties.published = derivePublishedDate(mf2);
    properties.slug = deriveSlug(mf2, config['slug-separator']);

    // Detirmine host file path and permalink
    const postPath = templates.renderString(postTypeConfig.post.path, properties);
    let postUrl = templates.renderString(postTypeConfig.post.url, properties);
    postUrl = derivePermalink(me, postUrl);

    // Prepare content
    // const templatePath = postTypeConfig.template;
    // const content = await templates.render(templatePath, properties);

    // TODO: Record action in post store
    const postData = {
      type: postType,
      path: postPath,
      url: postUrl,
      mf2: {
        type: (postType === 'event') ? ['h-event'] : ['h-entry'],
        properties
      }
    };

    // TODO: Post content to content host
    return response.send(postData);
  } catch (error) {
    return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
  }
};
