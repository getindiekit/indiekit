import fs from 'fs';
import * as settingsModel from '../models/settings.js';

/**
 * @returns {Promise|object} Configuration object
 */
export async function read() {
  // Get saved settings values
  const data = await settingsModel.getAll();

  // Get package metadata
  const pkg = JSON.parse(fs.readFileSync('package.json'));

  // Application settings
  const settings = {
    name: data.name || 'IndieKit',
    version: pkg.version,
    description: pkg.description,
    repository: pkg.repository,
    locale: data.locale || 'en',
    themeColor: data.themeColor || '#0000ee'
  };

  return settings;
}

/**
 * @param {object} values Values to save
 * @returns {boolean} True if operation successful
 */
export async function write(values) {
  try {
    await settingsModel.setAll(values);
    return true;
  } catch (error) {
    throw new Error(error);
  }
}
