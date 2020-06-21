export default class {
  constructor(client, keyId) {
    this.client = client;
    this.keyId = keyId;
  }

  /**
   * @param {string} field Field to lookup
   * @returns {Promise|object} Configuration object
   */
  async get(field) {
    const fieldValues = await this.getAll();
    return fieldValues[field];
  }

  /**
   * @returns {Promise|object} Configuration object
   */
  async getAll() {
    return this.client.hgetall(this.keyId);
  }

  /**
   * @param {string} field Field to lookup
   * @param {string} value Value to insert
   * @returns {Promise|boolean} 0|1
   */
  async set(field, value) {
    return this.client.hset(this.keyId, field, value);
  }

  /**
   * @param {object} fieldValues Fields and values to insert
   * @returns {Promise|boolean} 0|1
   */
  async setAll(fieldValues) {
    return this.client.hmset(this.keyId, fieldValues);
  }
}
