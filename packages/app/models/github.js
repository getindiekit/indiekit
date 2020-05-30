import Model from './model.js';

export class GithubModel extends Model {
  constructor(keyId) {
    super(keyId);
    this.keyId = 'github';
  }

  async getAll() {
    const data = await super.getAll();

    const github = {
      user: data.user || null,
      repo: data.repo || null,
      branch: data.branch || 'master',
      token: data.token || null
    };

    return github;
  }
}
