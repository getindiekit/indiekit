import { fetch } from "undici";

export const Cache = class {
  /**
   * Fetch data from cache or remote file
   *
   * @param {object} collection Collection
   */
  constructor(collection) {
    this.collection = collection;
  }

  /**
   * Cache JSON data
   *
   * @param {string} key Record key
   * @param {string} url URL of remote file
   * @returns {Promise|object} File data
   */
  async json(key, url) {
    try {
      const cachedData = this.collection
        ? await this.collection.findOne({ key, url })
        : false;
      if (cachedData) {
        const { data } = cachedData;
        return {
          source: "cache",
          data,
        };
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (this.collection) {
        await this.collection.replaceOne(
          {},
          { key, url, data },
          {
            upsert: true,
          }
        );
      }

      return {
        source: url,
        data,
      };
    } catch (error) {
      throw new Error(`Unable to fetch ${url}: ${error.message}`);
    }
  }
};
