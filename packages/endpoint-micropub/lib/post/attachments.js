import FormData from 'form-data';
import got from 'got';

/**
 * Upload attached media and update Microformats2 via
 * internally configured media endpoint
 *
 * @param {object} publication Publication configuration
 * @param {object} mf2 Microformats 2
 * @param {object} files Files attached to request
 * @returns {object} Updated Microformats2
 */
export const processAttachments = async (publication, mf2, files) => {
  mf2.properties.audio = mf2.properties.audio || [];
  mf2.properties.photo = mf2.properties.photo || [];
  mf2.properties.video = mf2.properties.video || [];

  if (files && files.length > 0) {
    const endpointResponses = [];
    for (const file of files) {
      // Create multipart/form-data
      const form = new FormData();
      form.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });

      // Upload file via media endpoint
      const mediaEndpoint = publication.config['media-endpoint'];
      const endpointResponse = got.post(mediaEndpoint, {
        headers: form.getHeaders(),
        body: form
      }).json();

      // Update micropub responses
      endpointResponses.push(endpointResponse);
    }

    // Add uploaded URL to media array
    const uploads = await Promise.all(endpointResponses);
    for (const upload of uploads) {
      mf2.properties[upload.type].push(upload.location);
    }
  }

  return mf2;
};
