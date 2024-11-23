import { getObjectId } from "@indiekit/util";

export const postTypeCount = {
  /**
   * Count the number of posts of a given type
   * @param {object} postsCollection - Posts database collection
   * @param {object} properties - JF2 properties
   * @returns {Promise<object>} Post count
   */
  async get(postsCollection, properties) {
    if (!postsCollection || !postsCollection.count()) {
      console.warn("No database configuration provided");
      console.info(
        "See https://getindiekit.com/configuration/application/#mongodburl",
      );

      return;
    }

    // Post type
    const postType = properties["post-type"];
    const postUid = properties.uid;
    const startDate = new Date(new Date(properties.published).toDateString());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const response = await postsCollection
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
            _id: getObjectId(postUid),
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
