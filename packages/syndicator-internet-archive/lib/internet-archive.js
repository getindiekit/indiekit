/**
 * Save Page Now 2 (SPN2) API
 * @class
 * @see {@link https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/}
 */
export class InternetArchive {
  /**
   * @param {object} options - Internet Archive SPN2 options
   * @param {string} options.accessKey - S3 access key
   * @param {string} options.secretKey - S3 secret key
   */
  constructor(options) {
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
  }

  /**
   * Initialise Internet Archive SPN2 client
   * @access private
   * @param {string} path - Path
   * @param {string} [method] - Method
   * @param {Record<string, string>} [data] - Data
   * @returns {Promise<unknown>} Response body
   * @throws {Error} Failed response
   */
  async #client(path, method = "GET", data) {
    const url = new URL(path, "https://web.archive.org");

    const response = await fetch(url.href, {
      method,
      headers: {
        accept: "application/json",
        authorization: `LOW ${this.accessKey}:${this.secretKey}`,
      },
      ...(data && { body: new URLSearchParams(data).toString() }),
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message);
    }

    return body;
  }

  /**
   * Make capture request
   * @param {string} url - URL to archive
   * @returns {Promise<CaptureResponse>} Capture response
   */
  async capture(url) {
    const response = await this.#client("/save", "POST", { url });

    return /** @type {CaptureResponse} */ (response);
  }

  /**
   * Make status request, polling until the capture has finished
   * @param {string} jobId - Capture job ID
   * @returns {Promise<StatusSuccessResponse>} Status response
   * @throws {Error} Capture failed
   */
  async status(jobId) {
    const response = /** @type {StatusResponse} */ (
      await this.#client(`/save/status/${jobId}`)
    );

    switch (response.status) {
      case "success": {
        return response;
      }

      case "error": {
        throw new Error(response.message);
      }

      default: {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        return this.status(jobId);
      }
    }
  }

  /**
   * Save to Internet Archive
   * @param {Jf2Properties} properties - JF2 properties
   * @returns {Promise<string>} URL of archived web page
   */
  async save(properties) {
    // Get a job ID from capture request
    const { job_id } = await this.capture(properties.url);

    // Get original URL and timestamp of archived web page
    const { original_url, timestamp } = await this.status(job_id);

    // Return syndicated URL
    return `https://web.archive.org/web/${timestamp}/${original_url}`;
  }
}

/**
 * @typedef {object} CaptureResponse
 * @property {string} job_id - Capture job ID
 * @property {string} url - URL being captured
 */

/**
 * @typedef {object} StatusPendingResponse
 * @property {"pending"} status - Capture is in progress
 */

/**
 * @typedef {object} StatusSuccessResponse
 * @property {"success"} status - Capture has finished
 * @property {string} original_url - URL that was captured
 * @property {string} timestamp - Capture timestamp, i.e. `20180326070330`
 */

/**
 * @typedef {object} StatusErrorResponse
 * @property {"error"} status - Capture has failed
 * @property {string} message - Reason the capture failed
 */

/**
 * @typedef {StatusPendingResponse|StatusSuccessResponse|StatusErrorResponse} StatusResponse
 */
