/**
 * Return queryable publication configuration
 *
 * @param {object} application Application configuration
 * @param {object} publication Publication configuration
 * @returns {object} Queryable configuration
 */
export const getConfig = (application, publication) => {
  const { url } = application;

  const { categories, mediaEndpoint, postTypes, syndicationTargets } =
    publication;

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
    "post-types": postTypes.map((postType) => ({
      type: postType.type,
      name: postType.name,
    })),
    "syndicate-to": syndicateTo,
    q,
  };
};

/**
 * Query a list
 *
 * @param {Array} list List of items
 * @param {object} options Options (filter, limit, offset)
 * @returns {Array} Updated list
 */
export const queryList = (list, options) => {
  const { filter, limit } = options;
  list = list || [];

  if (filter) {
    list = list.filter((item) => {
      item = JSON.stringify(item);
      item = item.toLowerCase();
      return item.includes(filter);
    });
  }

  if (limit) {
    const offset = options.offset || 0;
    list = list.slice(offset, offset + limit);
    list.length = Math.min(list.length, limit);
  }

  return list;
};
