/**
 * Get Micropub endpoint from server derived values
 *
 * @param {object} publication Publication configuration
 * @param {object} request HTTP request
 * @returns {string} Media endpoint URL
 */
export const getMicropubEndpoint = (publication, request) => {
  const { micropubEndpoint } = publication;

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
  const { posts } = publication;
  let postData = {};

  if (url) {
    // Get item in database which matching URL
    postData = await posts.findOne({
      "properties.url": url,
    });
  } else {
    // Get items in database and return first item
    const items = await posts.find().toArray();
    postData = items[items.length - 1];
  }

  return postData;
};
