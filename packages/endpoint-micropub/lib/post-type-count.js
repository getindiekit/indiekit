import { IndiekitError } from "@indiekit/error";

export const postTypeCount = {
  /**
   * Count the number of posts of a given type
   *
   * @param {object} publication - Publication configuration
   * @param {object} properties - JF2 properties
   * @returns {object} Post count
   */
  async get(publication, properties) {
    if (!publication) {
      throw new IndiekitError("No publication configuration provided");
    }

    if (!publication.posts || !publication.posts.count()) {
      throw new IndiekitError("No database configuration provided");
    }

    if (!properties) {
      throw IndiekitError.badRequest("No properties included in request");
    }

    // Post type
    const postType = properties["post-type"];
    const startDate = new Date(new Date(properties.published).toDateString());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const response = await publication.posts
      .aggregate([
        {
          $addFields: {
            convertedDate: {
              $toDate: "$properties.published",
            },
          },
        },
        {
          $match: {
            "properties.post-type": postType,
            convertedDate: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
      ])
      .toArray();
    return response.length;
  },
};
