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
  const {posts, jf2Feed} = publication;
  let postData;

  if (url) {
    // Get item in database which matching URL
    postData = await posts.findOne({
      'properties.url': url
    });
  } else if (jf2Feed) {
    // Fetch JSON Feed and return first child
    try {
      const {body} = await got(jf2Feed, {
        responseType: 'json'
      });
      const {children} = body;
      if (body.children.length > 0) {
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
