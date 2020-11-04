import {debug} from '../index.js';
import FormData from 'form-data';
import got from 'got';

const request = options => {
  return got.extend({
    prefixUrl: 'https://web.archive.org/save',
    responseType: 'json',
    resolveBodyOnly: true,
    headers: {
      authorization: `LOW ${options.accessKey}:${options.secret}`
    }
  });
};

/**
 * Save Page Now 2 (SPN2) API
 *
 * @typedef Response
 * @property {object} response SPN2 response
 * @param {object} options Options
 * @returns {object} SPN2 response
 * @see https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/
 */
export const internetArchive = options => ({
  /**
   * Make capture request
   *
   * @param {object} url URL to archive
   * @returns {Promise<Response>} Capture response
   */
  async capture(url) {
    try {
      const body = new FormData();
      body.append('url', url);

      const response = await request(options).post({body});

      return response;
    } catch (error) {
      throw new Error(error.response.body.message);
    }
  },

  /**
   * Make status request
   *
   * @param {object} jobId Capture job ID
   * @returns {Promise<Response>} Status response
   */
  async status(jobId) {
    try {
      const response = await request(options).get(`status/${jobId}`);

      switch (response.status) {
        case 'success':
          debug('success', response);
          return response;

        case 'error':
          debug('error', response);
          throw new Error(response.message);

        default:
          debug(`Capture for job ${jobId} is pending`);
          await new Promise(resolve => {
            setTimeout(resolve, 1000);
          });
          return this.status(jobId);
      }
    } catch (error) {
      throw new Error(error.response ? error.response.body : error.message);
    }
  }
});
