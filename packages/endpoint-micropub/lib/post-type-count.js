import HttpError from 'http-errors';
import {getPostType} from './post-type-discovery.js';
import {normaliseProperties} from './jf2.js';

export const postTypeCount = {
  /**
   * Count number of posts in given type
   *
   * @param {object} publication Publication configuration
   * @param {object} properties JF2 properties
   * @returns {object} Post count
   */
  async get(publication, properties) {
    try {
      if (!publication) {
        throw new Error('No publication configuration provided');
      }

      if (!publication.posts || !publication.posts.count()) {
        throw new Error('No database configuration provided');
      }

      if (!properties) {
        throw new Error('No properties included in request');
      }

      // Normalise properties
      properties = normaliseProperties(publication, properties);

      // Post type
      const type = getPostType(properties);
      const startDate = new Date(new Date(properties.published).toDateString());
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      const response = await publication.posts
        .aggregate([
          {
            $addFields: {
              convertedDate: {
                $toDate: '$properties.published',
              },
            },
          },
          {
            $match: {
              'properties.post-type': type,
              convertedDate: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          },
        ])
        .toArray();
      return response.length;
    } catch (error) {
      throw new HttpError(400, error);
    }
  },
};
