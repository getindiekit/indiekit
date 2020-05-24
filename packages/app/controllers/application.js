import fs from 'fs';
import * as applicationModel from '../models/application.js';

/**
 * @returns {Promise|object} Configuration object
 */
export async function read() {
  // Get saved settings values
  const data = await applicationModel.getAll();

  // Get package metadata
  const package_ = JSON.parse(fs.readFileSync('package.json'));

  // Application settings
  const application = {
    name: data.name || 'IndieKit',
    version: package_.version,
    description: package_.description,
    repository: package_.repository,
    locale: data.locale || 'en',
    themeColor: data.themeColor || '#0000ee'
  };

  return application;
}

/**
 * @param {object} values Values to save
 * @returns {boolean} True if operation successful
 */
export async function write(values) {
  try {
    await applicationModel.setAll(values);
    return true;
  } catch (error) {
    throw new Error(error);
  }
}
