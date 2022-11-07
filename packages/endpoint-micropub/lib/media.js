/* global Blob */
import { fetch, FormData } from "undici";

/**
 * Upload attached file(s) via media endpoint
 *
 * @param {string} token - Bearer token
 * @param {object} publication - Publication configuration
 * @param {object} properties - JF2 properties
 * @param {object} files - Files to upload
 * @returns {Array} Uploaded file locations
 */
export const uploadMedia = async (token, publication, properties, files) => {
  const { mediaEndpoint } = publication;

  for await (let [mediaProperty, media] of Object.entries(files)) {
    // Media property may contain one or many media files
    media = Array.isArray(media) ? media : [media];

    for await (const file of media) {
      const { data, name } = file;

      // Create multipart/form-data
      const formData = new FormData();
      formData.append("file", new Blob([data]), name);

      // Upload file via media endpoint
      const response = await fetch(mediaEndpoint, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json();
        const message = body.error_description || response.statusText;
        throw new Error(message);
      }

      // Update respective media property with location of upload
      properties[mediaProperty] = properties[mediaProperty] || [];
      properties[mediaProperty].push(response.headers.get("location"));
    }
  }

  return properties;
};
