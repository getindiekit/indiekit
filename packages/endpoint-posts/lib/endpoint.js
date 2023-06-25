import { IndiekitError } from "@indiekit/error";

export const endpoint = {
  /**
   * Micropub query
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
   * @param {object} [jsonBody] - JSON body
   * @returns {Promise<object>} Response data
   */
  async post(url, accessToken, jsonBody = false) {
    const endpointResponse = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
        ...(jsonBody && { "content-type": "application/json" }),
      },
      ...(jsonBody && { body: JSON.stringify(jsonBody) }),
    });

    if (!endpointResponse.ok) {
      throw await IndiekitError.fromFetch(endpointResponse);
    }

    const body = await endpointResponse.json();

    return body;
  },
};
