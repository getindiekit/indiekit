import fs from 'fs';
import getPostType from 'post-type-discovery';
import {templates} from './nunjucks.js';
import {
  getContent,
  getPermalink,
  getPublishedDate,
  getSlug
} from './microformats/properties.js';

export const createPostData = (mf2, config, me) => {
  try {
    const type = getPostType(mf2);
    const typeConfig = config['post-types'].find(item => item.type === type);
    const {properties} = mf2;
    properties.content = getContent(mf2);
    // TODO: Use publication locale and timezone
    properties.published = getPublishedDate(mf2);
    properties.slug = getSlug(mf2, config['slug-separator']);
    const path = templates.renderString(typeConfig.post.path, properties);
    let url = templates.renderString(typeConfig.post.url, properties);
    url = getPermalink(me, url);

    const postData = {
      type,
      path,
      url,
      mf2: {
        type: (type === 'event') ? ['h-event'] : ['h-entry'],
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
    const template = fs.readFileSync(templatePath, 'utf-8');
    const postContent = templates.renderString(template, properties);

    return postContent;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const Post = class {
  constructor(publication) {
    this.config = publication.config;
    this.me = publication.me;
    this.store = publication.store;
  }

  async create(mf2) {
    const {config, me} = this;

    try {
      const postData = await createPostData(mf2, config, me);

      const typeConfig = config['post-types'].find(
        item => item.type === postData.type
      );
      const content = createPostContent(postData, typeConfig);
      const message = 'message';
      const published = await this.store.createFile(postData.path, content, message);

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
