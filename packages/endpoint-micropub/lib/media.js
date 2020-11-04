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
  const {bearerToken, mediaEndpoint} = publication;

  for await (const file of files) {
    // Create multipart/form-data
    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    // Upload file via media endpoint
    let upload;
    try {
      upload = await got.post(mediaEndpoint, {
        body: form,
        headers: form.getHeaders({
          authorization: `Bearer ${bearerToken}`
        }),
        responseType: 'json'
      });
    } catch (error) {
      throw new Error(error.response ? error.response.body.error_description : error.message);
    }

    // Update respective media property with location of upload
    const filetype = file.fieldname.replace('[]', '');
    mf2.properties[filetype] = mf2.properties[filetype] || [];
    mf2.properties[filetype].push(upload.headers.location);
  }

  return mf2;
};
