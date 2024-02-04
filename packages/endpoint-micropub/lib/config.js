/**
 * Return queryable publication configuration
 * @param {object} application - Application configuration
 * @param {object} publication - Publication configuration
 * @returns {object} Queryable configuration
 */
export const getConfig = (application, publication) => {
  const { mediaEndpoint, url } = application;
  const { categories, postTypes, syndicationTargets } = publication;

  // Supported queries
  const q = [
    "category",
    "config",
    "media-endpoint",
    "post-types",
    "source",
    "syndicate-to",
  ];

  // Ensure syndication targets use absolute URLs
  const syndicateTo = syndicationTargets.map((target) => target.info);
  for (const info of syndicateTo) {
    if (info.service && info.service.photo) {
      info.service.photo = new URL(info.service.photo, url).href;
    }
  }

  return {
    categories,
    "media-endpoint": mediaEndpoint,
    "post-types": Object.values(postTypes).map((postType) => ({
      type: postType.type,
      name: postType.name,
      h: postType.h,
      properties: postType.properties,
      "required-properties": postType["required-properties"],
    })),
    "syndicate-to": syndicateTo,
    q,
  };
};

/**
 * Query config value
 * @param {Array} property - Property to query
 * @param {object} options - List options (filter, limit, offset)
 * @param {*} [options.filter] - Value to filter items by
 * @param {number} [options.limit] - Limit of items to return
 * @param {number} [options.offset] - Offset to start limit of items
 * @returns {Array} Updated config property
 */
export const queryConfig = (property, options) => {
  const { filter, limit } = options;

  if (!Array.isArray(property)) {
    return property;
  }

  let properties = property || [];

  if (filter) {
    properties = properties.filter((item) => {
      item = JSON.stringify(item);
      item = item.toLowerCase();
      return item.includes(filter);
    });
  }

  if (limit) {
    const offset = options.offset || 0;
    properties = properties.slice(offset, offset + limit);
    properties.length = Math.min(properties.length, limit);
  }

  return properties;
};
