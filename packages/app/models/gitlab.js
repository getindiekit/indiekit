import Model from './model.js';

export class GitlabModel extends Model {
  constructor(keyId) {
    super(keyId);
    this.keyId = 'gitlab';
  }

  async getAll() {
    const data = await super.getAll();

    const gitlab = {
      instance: data.instance || 'https://gitlab.com',
      user: data.user || null,
      repo: data.repo || null,
      branch: data.branch || 'master',
      token: data.token || null
    };

    return gitlab;
  }
}
