import { fetch } from "undici";
import { debug } from "../index.js";

/**
 * Save Page Now 2 (SPN2) API
 *
 * @typedef Response
 * @property {object} response SPN2 response
 * @param {object} options Options
 * @returns {object} SPN2 response
 * @see {@link https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/}
 */
export const internetArchive = (options) => ({
  async client(path, method = "GET", data) {
    const url = new URL(path, "https://web.archive.org");

    const response = await fetch(url.href, {
      method,
      headers: {
        accept: "application/json",
        authorization: `LOW ${options.accessKey}:${options.secret}`,
      },
      ...(data && { body: new URLSearchParams(data).toString() }),
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message);
    }

    return body;
  },

  /**
   * Make capture request
   *
   * @param {object} url URL to archive
   * @returns {Promise<Response>} Capture response
   */
  async capture(url) {
    return this.client("/save", "POST", { url });
  },

  /**
   * Make status request
   *
   * @param {object} jobId Capture job ID
   * @returns {Promise<Response>} Status response
   */
  async status(jobId) {
    const response = await this.client(`/save/status/${jobId}`);

    switch (response.status) {
      case "success":
        debug("success", response);
        return response;

      case "error":
        debug("error", response);
        throw new Error(response.message);

      default:
        debug(`Capture for job ${jobId} is pending`);
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        return this.status(jobId);
    }
  },

  /**
   * Save to Internet Archive
   *
   * @param {object} properties JF2 properties object
   * @returns {string} URL of archived web page
   */
  async save(properties) {
    // Get a job ID from capture request
    const { job_id } = await this.capture(properties.url);

    // Get original URL and timestamp of archived web page
    debug(`Capture of ${properties.url} assigned to job ${job_id}`);
    const { original_url, timestamp } = await this.status(job_id);

    // Return syndicated URL
    return `https://web.archive.org/web/${timestamp}/${original_url}`;
  },
});
