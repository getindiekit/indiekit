import HttpError from 'http-errors';
import mongodb from 'mongodb';

const {ObjectId} = mongodb;

export const filesController = publication => ({
  /**
   * List previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @returns {object} HTTP response
   */
  async list(request, response) {
    response.render('files', {
      title: response.__('media.files.title'),
      files: await publication.media.find().toArray(),
      parentUrl: `${publication.mediaEndpoint}/files/`
    });
  },

  /**
   * View previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async view(request, response, next) {
    try {
      const {id} = request.params;
      const file = await publication.media.findOne({_id: new ObjectId(id)});

      if (!file) {
        throw new HttpError(404, 'No file was found with this UUID');
      }

      response.render('file', {
        parent: response.__('media.files.title'),
        file
      });
    } catch (error) {
      next(error);
    }
  }
});
