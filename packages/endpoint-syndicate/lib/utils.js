/**
 * Get post data
 * @param {object} application - Application configuration
 * @param {string} url - URL of existing post (optional)
 * @returns {Promise<object>} Post data for given URL else recently published post
 */
export const getPostData = async (application, url) => {
  const { posts } = application;
  let postData = {};

  if (url) {
    // Get item in database which matching URL
    postData = await posts.findOne({
      "properties.url": url,
    });
  } else {
    // Get published posts awaiting syndication and return first item
    const items = await posts
      .find({
        "properties.mp-syndicate-to": {
          $exists: true,
        },
        "properties.syndication": {
          $exists: false,
        },
        "properties.post-status": {
          $ne: "draft",
        },
      })
      .sort({ "properties.published": -1 })
      .limit(1)
      .toArray();
    postData = items[0];
  }

  return postData;
};

/**
 * Check if target already returned a syndication URL
 * @param {Array} syndicatedUrls - Syndication URLs
 * @param {string} syndicateTo - Syndication target
 * @returns {boolean} Target returned a syndication URL
 */
export const hasSyndicationUrl = (syndicatedUrls, syndicateTo) => {
  return syndicatedUrls.some((url) => url.startsWith(syndicateTo));
};

/**
 * Check if post syndication target is a publication target
 * @param {Array} publicationTargets - Publication syndication targets
 * @param {string} syndicateTo - Syndication target
 * @returns {boolean} Post syndication target is a publication target
 */
export const isSyndicationTarget = (publicationTargets, syndicateTo) => {
  return publicationTargets.some((target) =>
    syndicateTo.includes(target?.info?.uid)
  );
};

export const syndicateToTargets = async (publication, properties) => {
  const syndicateTo = properties["mp-syndicate-to"];
  const syndicatedUrls = properties.syndication || [];
  const { syndicationTargets } = publication;
  const failedTargets = [];

  for await (const target of syndicationTargets) {
    const canSyndicate =
      !hasSyndicationUrl(syndicatedUrls, syndicateTo) &&
      isSyndicationTarget(syndicationTargets, syndicateTo);

    if (canSyndicate) {
      try {
        const syndicatedUrl = await target.syndicate(properties, publication);

        // Add syndicated URL to list of syndicated URLs
        syndicatedUrls.push(syndicatedUrl);
      } catch (error) {
        // Add failed syndication target to list of failed targets
        failedTargets.push(target.info.uid);
        console.error(error.message);
      }
    }
  }

  return {
    ...(failedTargets.length > 0 && { failedTargets }),
    syndicatedUrls,
  };
};
