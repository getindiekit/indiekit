import mongodb from 'mongodb';

const {ObjectId} = mongodb;

export const filesController = publication => ({
  /**
   * List previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  list: async (request, response, next) => {
    try {
      response.render('files', {
        title: response.__('media.files.title'),
        files: await publication.media.find().toArray(),
        parentUrl: `${publication.mediaEndpoint}/files/`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * View previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  view: async (request, response, next) => {
    try {
      const {id} = request.params;
      const file = await publication.media.findOne({_id: new ObjectId(id)});

      const properties = [];
      Object.entries(file.properties).forEach(
        ([key, value]) => properties.push({
          key: {
            text: key
          },
          value: {
            text: value
          }
        })
      );

      response.render('file', {
        parent: response.__('media.files.title'),
        title: file.properties.filename,
        published: file.properties.published,
        type: file.properties['post-type'],
        url: file.properties.url,
        properties
      });
    } catch (error) {
      next(error);
    }
  }
});
