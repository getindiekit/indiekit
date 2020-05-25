import * as githubModel from '../models/github.js';

/**
 * @returns {Promise|object} Configuration object
 */
export const read = async () => {
  const data = await githubModel.getAll();

  const github = {
    user: data.user,
    repo: data.repo,
    branch: data.branch || 'master',
    token: data.token
  };

  return github;
};

/**
 * @param {object} values Values to save
 * @returns {boolean} True if operation successful
 */
export async function write(values) {
  try {
    await githubModel.setAll(values);
    return true;
  } catch (error) {
    throw new Error(error);
  }
}
