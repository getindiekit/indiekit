/**
 * Database collections the endpoint keeps
 * @module storage/collections
 */

/**
 * Get the channels collection
 * @param {object} application - Indiekit application
 * @returns {object} MongoDB collection
 */
export const getChannelsCollection = (application) =>
  application.collections.get("microsub_channels");

/**
 * Get the timeline items collection
 * @param {object} application - Indiekit application
 * @returns {object} MongoDB collection
 */
export const getItemsCollection = (application) =>
  application.collections.get("microsub_items");
