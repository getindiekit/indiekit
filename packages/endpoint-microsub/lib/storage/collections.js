/**
 * Database collections the endpoint keeps
 * @module storage/collections
 */

/**
 * Get the channels collection
 * @param {IndiekitApplication} application - Indiekit application
 * @returns {Collection} MongoDB collection
 */
export const getChannelsCollection = (application) =>
  application.collections.get("microsub_channels");

/**
 * Get the timeline items collection
 * @param {IndiekitApplication} application - Indiekit application
 * @returns {Collection} MongoDB collection
 */
export const getItemsCollection = (application) =>
  application.collections.get("microsub_items");
