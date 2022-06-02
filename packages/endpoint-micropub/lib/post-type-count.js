import httpError from "http-errors";

export const postTypeCount = {
  /**
   * Count the number of posts of a given type
   *
   * @param {object} publication Publication configuration
   * @param {object} properties JF2 properties
   * @returns {object} Post count
   */
  async get(publication, properties) {
    try {
      if (!publication) {
        throw new httpError.InternalServerError(
          "No publication configuration provided"
        );
      }

      if (!publication.posts || !publication.posts.count()) {
        throw new httpError.InternalServerError(
          "No database configuration provided"
        );
      }

      if (!properties) {
        throw new httpError.BadRequest("No properties included in request");
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
    } catch (error) {
      throw httpError(error);
    }
  },
};
