import { getInstalledPlugin } from "./plugins.js";

/**
 * Get configured content store
 * @param {IndiekitInstance} Indiekit - Indiekit instance
 * @returns {IndiekitStore|undefined} Content store
 */
export const getStore = (Indiekit) => {
  const { config, installedPlugins, stores } = Indiekit;
  const { store } = config.publication;

  // `publication.store` may already be a resolved store function
  if (typeof store === "object") {
    return store;
  }

  return store
    ? /** @type {IndiekitStore|undefined} */ (
        getInstalledPlugin(installedPlugins, store)
      )
    : [...stores][0];
};

/**
 * Get configured media store
 * @param {IndiekitInstance} Indiekit - Indiekit instance
 * @returns {IndiekitStore|undefined} Media store
 */
export const getMediaStore = (Indiekit) => {
  const { config, installedPlugins } = Indiekit;
  const { mediaStore } = config.publication;

  // `publication.mediaStore` may already be a resolved store function
  if (typeof mediaStore === "object") {
    return mediaStore;
  }

  return mediaStore
    ? /** @type {IndiekitStore|undefined} */ (
        getInstalledPlugin(installedPlugins, mediaStore)
      )
    : getStore(Indiekit);
};
