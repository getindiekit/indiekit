/**
 * Merge values from custom and default configurations
 *
 * @param {object} customConfig Custom configuration
 * @param {object} defaultConfig Default configuration
 * @returns {object} Merged configuration
 */
export default (customConfig, defaultConfig) => {
  // Merge configuration objects
  const config = {...defaultConfig, ...customConfig};

  // Combine post type arrays (leaving duplicate post types)
  const customPostTypes = customConfig['post-types'] || [];
  const defaultPostTypes = defaultConfig['post-types'] || [];
  const combinedPostTypes = [
    ...customPostTypes,
    ...defaultPostTypes
  ];

  // Merge duplicate post types
  const set = new Set();
  const mergedPostTypes = combinedPostTypes.filter(postType => {
    if (!set.has(postType.type)) {
      set.add(postType.type);
      return true;
    }

    return false;
  }, set);

  config['post-types'] = mergedPostTypes;

  return config;
};
