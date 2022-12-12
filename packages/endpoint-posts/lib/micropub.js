import { IndiekitError } from "@indiekit/error";

export const micropub = {
  /**
   * Micropub query
   *
   * @param {string} url - URL
   * @param {string} accessToken - Access token
   * @returns {object} Response data
   */
  async get(url, accessToken) {
    const micropubResponse = await fetch(url, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    if (!micropubResponse.ok) {
      throw await IndiekitError.fromFetch(micropubResponse);
    }

    const body = await micropubResponse.json();

    return body;
  },

  /**
   * Micropub action
   *
   * @param {string} url - URL
   * @param {string} accessToken - Access token
   * @param {object} [jsonBody=false] - JSON body
   * @returns {object} Response data
   */
  async post(url, accessToken, jsonBody = false) {
    const micropubResponse = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
        ...(jsonBody && { "content-type": "application/json" }),
      },
      ...(jsonBody && { body: JSON.stringify(jsonBody) }),
    });

    if (!micropubResponse.ok) {
      throw await IndiekitError.fromFetch(micropubResponse);
    }

    const body = await micropubResponse.json();

    return body;
  },
};
