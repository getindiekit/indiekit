import path from 'path';
import got from 'got';

/**
 * Convert JF2 to Microformats2 object
 *
 * @param {string} jf2 JF2
 * @returns {string} Micropub action
 */
export const jf2ToMf2 = jf2 => {
  const mf2 = {
    type: [`h-${jf2.type}`],
    properties: {}
  };

  delete jf2.type;

  // Convert values to arrays, ie 'a' => ['a'] and move to properties object
  for (const key in jf2) {
    if (Object.prototype.hasOwnProperty.call(jf2, key)) {
      mf2.properties[key] = [].concat(jf2[key]);
    }
  }

  // Update key for plaintext content
  if (mf2.properties.content[0] && mf2.properties.content[0].text) {
    mf2.properties.content[0].value = jf2.content.text;
    delete mf2.properties.content[0].text;
  }

  return mf2;
};

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
    // Fetch JF2 Feed and return first child
    try {
      const {body} = await got(jf2Feed, {
        responseType: 'json'
      });
      const {children} = body;
      if (children.length > 0) {
        const properties = children[0];
        properties['mp-slug'] = path.basename(properties.url);

        // Check if feed item already exists in database
        const storedPostData = await posts.findOne({
          'properties.url': properties.url
        });

        if (storedPostData) {
          // Use stored post data
          postData = storedPostData;
        } else {
          // Import post data to database
          const mf2 = jf2ToMf2(properties);
          const importedPostData = {
            date: new Date(),
            mf2,
            properties,
            lastAction: 'import'
          };
          await posts.insertOne(importedPostData, {
            checkKeys: false
          });

          // Use imported post data
          postData = importedPostData;
        }
      } else {
        throw new Error('JF2 Feed does not contain any posts');
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
