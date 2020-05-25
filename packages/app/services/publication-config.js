/**
 * Return public publication values, and using preferred format
 *
 * @param {object} publication Publication settings
 * @param {object} request HTTP request
 * @returns {object} Public configuration object
 */
export default (publication, request) => {
  const {config} = publication;

  // Query media endpoint
  // Use custom value, or default based on server request values
  config['media-endpoint'] =
    publication['media-endpoint'] ||
    `${request.protocol}://${request.headers.host}/media`;

  // Query supported vocabulary
  // https://indieweb.org/Micropub-extensions#Query_for_Supported_Vocabulary
  const postTypes = config['post-types'];
  config['post-types'] = Object.keys(postTypes).map(key => ({
    type: key,
    name: postTypes[key].name
  }));

  return config;
};
