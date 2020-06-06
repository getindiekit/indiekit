import derivePostType from 'post-type-discovery';
import httpError from 'http-errors';
import {templates} from '../lib/nunjucks.js';
import {deriveContent, derivePermalink, derivePublishedDate, deriveSlug} from '../services/properties.js';
import {formEncodedToMf2} from '../services/transform-request.js';

export const derivePostProperties = async (mf2, config) => {
  try {
    const {properties} = mf2;
    properties.content = deriveContent(mf2);
    // TODO: Use publication locale and timezone
    properties.published = derivePublishedDate(mf2);
    properties.slug = deriveSlug(mf2, config['slug-separator']);

    return properties;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createPostData = async (mf2, config, me) => {
  try {
    const type = derivePostType(mf2);
    const typeConfig = config['post-types'].find(item => item.type === type);
    const properties = derivePostProperties(mf2, config);
    const path = templates.renderString(typeConfig.post.path, properties);
    let url = templates.renderString(typeConfig.post.url, properties);
    url = derivePermalink(me, postUrl);

    const postData = {
      type,
      path,
      url,
      mf2: {
        type: (postType === 'event') ? ['h-event'] : ['h-entry'],
        properties
      }
    };

    return postData;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createPostContent = (postData, postTypeConfig) => {
  try {
    // Derive properties
    const {properties} = postData.mf2;

    // Prepare content
    const templatePath = postTypeConfig.template;
    const postContent = templates.render(templatePath, properties);

    return postContent;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const Post = class {
  constructor(publisher) {
    this.client = publisher;
  }

  async create(request, response) {
    const {config, me} = response.locals.publication;

    try {
      const {body} = request;
      const mf2 = request.is('json') ? body : formEncodedToMf2(body);
      const postData = createPostData(mf2, config, me);
      const typeConfig = config['post-types'].find(
        item => item.type === postData.type
      );
      const content = createPostContent(postData, typeConfig);
      const message = 'message';
      const published = await publisher.createFile(postData.path, content, message);

      if (published) {
        return {
          location: postData.url,
          status: 202,
          success: 'create_pending',
          success_description: `Post will be created at ${postData.url}`
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
