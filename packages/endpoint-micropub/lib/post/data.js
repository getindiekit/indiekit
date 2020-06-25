import {templates} from '../nunjucks.js';
import getPostType from 'post-type-discovery';
import {getPostTypeConfig} from '../utils.js';
import {
  getContent,
  getPermalink,
  getPublishedDate,
  getSlug
} from '../microformats/properties.js';

export const createPostData = (mf2, publication) => {
  const {config, locale, me, timezone} = publication;

  try {
    // Post type
    const type = getPostType(mf2);
    const typeConfig = getPostTypeConfig(config, type);

    // Post properties
    const {properties} = mf2;
    properties.content = getContent(mf2);
    properties.published = getPublishedDate(mf2, locale, timezone);
    properties.slug = getSlug(mf2, config['slug-separator']);

    // Post paths
    const path = templates.renderString(typeConfig.post.path, properties);
    let url = templates.renderString(typeConfig.post.url, properties);
    url = getPermalink(me, url);

    // Add computed URL to post properties
    properties.url = [url];

    // Post data
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

export const readPostData = async (url, publication) => {
  return publication.posts.get(url);
};
