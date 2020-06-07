/**
 * Add server derived values to publication configuration.
 *
 * @param {object} publication Publication settings
 * @param {object} request HTTP request
 * @returns {object} Configuration object
 */
export const getMediaEndpoint = (publication, request) => {
  const {config} = publication;

  // Query media endpoint
  // Use custom value, or default based on server request values
  config['media-endpoint'] =
    publication['media-endpoint'] ||
    `${request.protocol}://${request.headers.host}/media`;

  return config;
};
