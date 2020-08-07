import got from 'got';

export const Cache = class {
  /** Fetch data from cache or remote file
   *
   * @param {object} database Database
   * @param {string} expires Timeout on key
   */
  constructor(database, expires) {
    this.database = database;
    this.expires = expires || 3600;
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
      const database = await this.database;
      const collection = await database.collection('cache');
      const cachedData = await collection.findOne({key, url});
      if (cachedData) {
        const {data} = cachedData;
        return {
          source: 'cache',
          data
        };
      }

      const fetchedData = await got(url, {responseType: 'json'});
      if (fetchedData) {
        const data = fetchedData.body;
        await collection.replaceOne({}, {key, url, data}, {
          upsert: true
        });
        return {
          source: url,
          data
        };
      }
    } catch (error) {
      throw new Error(`Unable to fetch ${url}: ${error.message}`);
    }
  }
};
