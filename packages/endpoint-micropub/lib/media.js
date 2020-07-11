import FormData from 'form-data';
import got from 'got';

/**
 * Upload attached file(s) via media endpoint
 *
 * @param {object} publication Publication configuration
 * @param {object} mf2 Microformats 2
 * @param {object} files Files to upload
 * @returns {Array} Uploaded file locations
 */
export const uploadMedia = async (publication, mf2, files) => {
  const mediaEndpoint = publication.config['media-endpoint'];
  const {bearerToken} = publication;
  const promises = [];

  for (const file of files) {
    // Create multipart/form-data
    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    // Upload file via media endpoint
    const endpointResponse = got.post(mediaEndpoint, {
      headers: form.getHeaders({
        authorization: `Bearer ${bearerToken}`
      }),
      body: form,
      responseType: 'json'
    });

    // Add to Micropub responses
    promises.push(endpointResponse);
  }

  // Return upload locations
  // TODO: Review and refine this implementation
  let uploads = await Promise.all(
    promises.map(promise => promise.catch(error => {
      throw new Error(error.response.body.error_description);
    }))
  );
  uploads = uploads.filter(result => !(result instanceof Error));

  uploads.forEach((upload, i) => {
    const {fieldname} = files[i];
    const filetype = fieldname.replace('[]', '');
    mf2.properties[filetype] = mf2.properties[filetype] || [];
    mf2.properties[filetype].push(upload.headers.location);
  });

  return mf2;
};
