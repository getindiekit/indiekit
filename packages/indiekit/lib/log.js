export const Log = class {
  constructor(client, hashId) {
    this.client = client;
    this.hashId = hashId;
  }

  /**
   * Get an object by field name
   *
   * @param {string} key Field to lookup
   * @returns {Promise|object} Field value
   */
  async get(key) {
    const hashes = await this.getAll();
    const value = hashes[key];
    if (value) {
      return value;
    }

    throw new Error(`No value found for ${key}`);
  }

  /**
   * Get an array of all objects, keyed by field name
   *
   * @returns {Promise|Array} Configuration object
   */
  async getAll() {
    const hash = await this.client.hgetall(this.hashId);

    // Convert hash values to JSON
    const hashJSON = Object.fromEntries(
      Object.entries(hash).map(([key, value]) => [key, JSON.parse(value)])
    );

    return hashJSON;
  }

  /**
   * Get an array of all objects, returning only those with specified
   * object key
   *
   * @param {string} objectKey Object key to return from each object
   * @returns {Promise|Array} Configuration object
   */
  async selectFromAll(objectKey) {
    const hash = await this.client.hgetall(this.hashId);
    const keys = Object.keys(hash);

    if (keys.length > 0) {
      const values = keys.map(key => JSON.parse(hash[key]));
      return values.map(value => {
        return value[objectKey];
      });
    }
  }

  /**
   * @param {string} key Key to lookup
   * @param {string} value Value to insert
   * @returns {Promise|boolean} 0|1
   */
  async set(key, value) {
    value = JSON.stringify(value);
    return this.client.hset(this.hashId, key, value);
  }
};
