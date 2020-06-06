import got from 'got';

/**
 * @param {string} url URL to validate
 * @param {string} responseType Type of file expected
 * @returns {Promise} Resolves if URL validates
 */
export const isValidUrl = async (url, responseType = 'text') => {
  try {
    await got(url, {responseType});
  } catch (error) {
    let {message} = error;
    if (error.name === 'TypeError') {
      message = 'Enter a valid URL, including protocol';
    } else if (error.name === 'RequestError') {
      message = 'Enter a URL that is publicly accessible';
    } else if (error.name === 'HTTPError' && error.response.statusCode === 404) {
      message = 'File not found. Enter a URL that is publicly accessible';
    } else if (error.name === 'ParseError' && responseType === 'json') {
      message = 'File should use the JSON format';
    }

    throw new Error(message);
  }
};
