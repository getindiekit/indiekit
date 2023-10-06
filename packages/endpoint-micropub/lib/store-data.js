import { getCanonicalUrl, getDate, getObjectId } from "@indiekit/util";

export const storeData = {
  async create(application, postData, url) {
    const { hasDatabase, posts, timeZone } = application;

    if (!hasDatabase) {
      return;
    }

    const query = { _id: getObjectId(postData._id) };
    const operation = {
      $set: {
        "storeProperties.path": postData.storeProperties.path,
        "storeProperties.published": getDate(timeZone),
        "storeProperties.url": getCanonicalUrl(url),
      },
    };

    await posts.updateOne(query, operation);
  },

  async update(application, postData, url) {
    const { hasDatabase, posts, timeZone } = application;

    if (!hasDatabase) {
      return;
    }

    const query = { _id: getObjectId(postData._id) };
    const update = {
      $set: {
        "storeProperties.path": postData.storeProperties.path,
        "storeProperties.updated": getDate(timeZone),
        "storeProperties.url": getCanonicalUrl(url),
      },
      $unset: {
        "storeProperties._originalPath": "",
      },
    };

    await posts.updateOne(query, update);
  },

  async delete(application, postData) {
    const { hasDatabase, posts, timeZone } = application;

    if (!hasDatabase) {
      return;
    }

    const query = { _id: getObjectId(postData._id) };
    const update = {
      $set: {
        "storeProperties.deleted": getDate(timeZone),
      },
      $unset: {
        "storeProperties.url": "",
      },
    };

    await posts.updateOne(query, update);
  },
};
