import FormData from 'form-data';
import got from 'got';
import mime from 'mime-types';
import path from 'path';

/**
 * Add location(s) of uploaded media to Microformats2
 *
 * @param {object} mf2 Microformats 2
 * @param {Array} uploads Uploaded file locations
 * @returns {object} Updated Microformats2
 */
export const addMediaLocations = (mf2, uploads) => {
  for (const upload of uploads) {
    const mediaType = getMediaType(upload);
    const typeProperty = mf2.properties[mediaType] || [];
    typeProperty.push({value: upload});
    mf2.properties[mediaType] = typeProperty;
  }

  return mf2;
};

/**
 * Upload attached file(s) via media endpoint
 *
 * @param {object} mediaEndpoint Media endpoint
 * @param {object} files Files to upload
 * @returns {Array} Uploaded file locations
 */
export const uploadMedia = async (mediaEndpoint, files) => {
  try {
    const endpointResponses = [];
    for (const file of files) {
      // Create multipart/form-data
      const form = new FormData();
      form.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });

      // Upload file via media endpoint
      const endpointResponse = got.post(mediaEndpoint, {
        headers: form.getHeaders(),
        body: form
      });

      // Add to Micropub responses
      endpointResponses.push(endpointResponse);
    }

    // Return upload locations
    const locations = [];
    for (const response of await Promise.all(endpointResponses)) {
      const {location} = response.headers;
      locations.push(location);
    }

    return locations;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get media type (and return equivalent IndieWeb post type)
 *
 * @param {object} filename File name
 * @returns {string} Post type ('photo', 'video' or 'audio')
 * @example getMediaType('brighton-pier.jpg') => 'photo'
 */
export const getMediaType = filename => {
  const extension = path.extname(filename);
  const mimetype = mime.lookup(extension);

  if (mimetype.includes('audio/')) {
    return 'audio';
  }

  if (mimetype.includes('image/')) {
    return 'photo';
  }

  if (mimetype.includes('video/')) {
    return 'video';
  }

  return null;
};
