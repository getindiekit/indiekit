import fs from 'fs';
import Model from './model.js';

export class ApplicationModel extends Model {
  constructor(keyId) {
    super(keyId);
    this.keyId = 'application';
  }

  async getAll() {
    try {
      const data = await super.getAll();
      const package_ = JSON.parse(fs.readFileSync('package.json'));

      const application = {
        name: data.name || 'IndieKit',
        version: package_.version || null,
        description: package_.description || null,
        repository: package_.repository || null,
        locale: data.locale || 'en',
        themeColor: data.themeColor || '#0000ee'
      };

      return application;
    } catch (error) {
      throw new Error(error);
    }
  }
}
