import { IndiekitError } from "@indiekit/error";

export const endpoint = {
  /**
   * Micropub media query
   * @param {string} url - URL
   * @param {string} accessToken - Access token
   * @returns {Promise<object>} Response data
   */
  async get(url, accessToken) {
    const endpointResponse = await fetch(url, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    if (!endpointResponse.ok) {
      throw await IndiekitError.fromFetch(endpointResponse);
    }

    const body = await endpointResponse.json();

    return body;
  },

  /**
   * Micropub action
   * @param {string} url - URL
   * @param {string} accessToken - Access token
   * @param {FormData} [formData] - Form data
   * @returns {Promise<object>} Response data
   */
  async post(url, accessToken, formData) {
    const endpointResponse = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      ...(formData && { body: formData }),
    });

    if (!endpointResponse.ok) {
      throw await IndiekitError.fromFetch(endpointResponse);
    }

    const body = await endpointResponse.json();

    return body;
  },
};
