import got from 'got';

/**
 * Get Micropub endpoint from server derived values
 *
 * @param {object} publication Publication configuration
 * @param {object} request HTTP request
 * @returns {string} Media endpoint URL
 */
export const getMicropubEndpoint = (publication, request) => {
  const {micropubEndpoint} = publication;

  return `${request.protocol}://${request.headers.host}${micropubEndpoint}`;
};

/**
 * Get post data
 *
 * @param {object} publication Publication configuration
 * @param {string} url URL of existing post (optional)
 * @returns {object} Post data for given url else recently published post
 */
export const getPostData = async (publication, url) => {
  const {posts, jsonFeed} = publication;
  let postData;

  if (url) {
    // Get item in database which matching URL
    postData = await posts.findOne({
      'properties.url': url
    });
  } else if (jsonFeed) {
    // Fetch JSON Feed and return first child
    try {
      const {body} = await got(jsonFeed, {
        responseType: 'json'
      });
      const {children} = jsonFeedtoJf2(body);
      if (children.length > 0) {
        postData = {
          properties: children[0]
        };
      } else {
        throw new Error('JSON feed does not contain any posts');
      }
    } catch (error) {
      const errorMessage = error.response ?
        error.response.body.message :
        error.message;
      throw new Error(errorMessage);
    }
  } else {
    // Get items in database and return first item
    const items = await posts.find().toArray();
    postData = items[items.length - 1];
  }

  return postData;
};

/**
 * Convert JSON Feed to JF2
 *
 * @param {object} feed JSON Feed
 * @returns {object} JF2
 */
// TODO: Abstract into sepatate module
export const jsonFeedtoJf2 = feed => {
  const jf2 = {};

  Object.keys(feed).forEach(key => {
    if (key.startsWith('_')) {
      const newKey = 'x' + key.replace(/_/g, '-');
      jf2[newKey] = feed[key];
    }
  });

  jf2.type = 'feed';
  jf2.name = feed.title;

  if (feed.home_page_url) {
    jf2.url = feed.home_page_url;
  }

  if (feed.icon) {
    jf2.photo = feed.icon;
  }

  if (feed.description) {
    jf2.summary = feed.description;
  }

  if (feed.author || feed.authors) {
    const author = feed.authors ? feed.authors[0] : feed.author;

    jf2.author = {
      type: 'card',
      ...(author.url && {url: author.url}),
      ...(author.name && {name: author.name}),
      ...(author.avatar && {photo: author.avatar})
    };
  }

  jf2.children = feed.items.map(feedItem => {
    const item = {};

    Object.keys(feedItem).forEach(key => {
      if (key.startsWith('_')) {
        const newKey = 'x' + key.replace(/_/g, '-');
        item[newKey] = feedItem[key];
      }
    });

    item.type = 'entry';

    item.uid = feedItem.id;

    if (feedItem.url) {
      // TODO: Fallback to `feedItem.id` if valid URL
      item.url = feedItem.url;
    }

    if (feedItem.title) {
      item.name = feedItem.title;
    }

    if (feedItem.summary) {
      item.summary = feedItem.summary;
    }

    if (feedItem.content_html || feedItem.content_text) {
      item.content = {
        ...(feedItem.content_html && {html: feedItem.content_html}),
        ...(feedItem.content_text && {text: feedItem.content_text})
      };
    }

    if (feedItem.image) {
      item.photo = feedItem.image;
    }

    if (feedItem.banner_image) {
      item.featured = feedItem.banner_image;
    }

    if (feedItem.date_published) {
      item.published = feedItem.date_published;
    }

    if (feedItem.date_modified) {
      item.updated = feedItem.date_modified;
    }

    if (feedItem.tags) {
      item.category = feedItem.tags;
    }

    if (feedItem.author || feedItem.authors) {
      const author = feedItem.authors ? feedItem.authors[0] : feedItem.author;

      item.author = {
        type: 'card',
        ...(author.url && {url: author.url}),
        ...(author.name && {name: author.name}),
        ...(author.avatar && {photo: author.avatar})
      };
    }

    if (feedItem.attachments) {
      const attachments = feedItem.attachments.map(attachment => ({
        url: attachment.url,
        ...(attachment.title && {alt: attachment.title}),
        'content-type': attachment.mime_type
      }));

      const audio = attachments.filter(attachment => attachment['content-type'].startsWith('audio/'));
      const photo = attachments.filter(attachment => attachment['content-type'].startsWith('image/'));
      const video = attachments.filter(attachment => attachment['content-type'].startsWith('video/'));

      if (audio.length > 0) {
        item.audio = audio;
      }

      if (photo.length > 0) {
        item.photo = photo;
      }

      if (video.length > 0) {
        item.video = video;
      }
    }

    return item;
  });

  return jf2;
};

