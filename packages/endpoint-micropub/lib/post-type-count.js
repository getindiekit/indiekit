export const postTypeCount = {
  /**
   * Count the number of posts of a given type
   * @param {object} publication - Publication configuration
   * @param {object} properties - JF2 properties
   * @returns {Promise<object>} Post count
   */
  async get(publication, properties) {
    if (!publication.posts || !publication.posts.count()) {
      console.warn("No database configuration provided");
      console.info(
        "See https://getindiekit.com/configuration/#application-mongodburl-url"
      );

      return;
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
