import { getInstalledPlugin } from "./plugins.js";

/**
 * Get configured content store
 * @param {object} Indiekit - Indiekit instance
 * @returns {object} Content store
 */
export const getStore = (Indiekit) => {
  const { installedPlugins, publication, stores } = Indiekit;

  // `publication.store` may already be a resolved store function
  if (typeof publication?.store === "object") {
    return publication.store;
  }

  return publication?.store
    ? getInstalledPlugin(installedPlugins, publication.store)
    : [...stores][0];
};

/**
 * Get configured media store
 * @param {object} Indiekit - Indiekit instance
 * @returns {object} Media store
 */
export const getMediaStore = (Indiekit) => {
  const { installedPlugins, publication } = Indiekit;

  // `publication.mediaStore` may already be a resolved store function
  if (typeof publication?.mediaStore === "object") {
    return publication.mediaStore;
  }

  return publication?.mediaStore
    ? getInstalledPlugin(installedPlugins, publication.mediaStore)
    : getStore(Indiekit);
};
