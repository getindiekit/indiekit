import * as gitlabModel from '../models/gitlab.js';

/**
 * @returns {Promise|object} Configuration object
 */
export const read = async () => {
  const data = await gitlabModel.getAll();

  const gitlab = {
    instance: data.instance || 'https://gitlab.com',
    user: data.user,
    repo: data.repo,
    branch: data.branch || 'master',
    token: data.token
  };

  return gitlab;
};

/**
 * @param {object} values Values to save
 * @returns {boolean} True if operation successful
 */
export async function write(values) {
  try {
    await gitlabModel.setAll(values);
    return true;
  } catch (error) {
    throw new Error(error);
  }
}
