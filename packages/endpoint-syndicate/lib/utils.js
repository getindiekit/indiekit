/**
 * Get post data
 * @param {object} postsCollection - Posts database collection
 * @param {string} url - URL of existing post (optional)
 * @returns {Promise<object>} Post data for given URL else recently published post
 */
export const getPostData = async (postsCollection, url) => {
  let postData = {};

  if (url) {
    // Get item in database which matching URL
    postData = await postsCollection.findOne({
      "properties.url": url,
    });
  } else {
    // Get published posts awaiting syndication and return first item
    const items = await postsCollection
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
  return syndicatedUrls.some((url) => {
    const { origin } = new URL(url);
    return syndicateTo.includes(origin);
  });
};

/**
 * Get syndication target for syndication URL
 * @param {Array} syndicationTargets - Publication syndication targets
 * @param {string} syndicateTo - Syndication URL
 * @returns {object|undefined} Publication syndication target
 */
export const getSyndicationTarget = (syndicationTargets, syndicateTo) => {
  return syndicationTargets.find((target) => {
    if (!target?.info?.uid) {
      return;
    }

    const targetOrigin = new URL(target.info.uid).origin;
    const syndicateToOrigin = new URL(syndicateTo).origin;
    return targetOrigin === syndicateToOrigin;
  });
};

/**
 * Syndicate URLs to configured syndication targets
 * @param {object} publication - Publication configuration
 * @param {object} properties - JF2 properties
 * @returns {Promise<object>} Syndication target
 */
export const syndicateToTargets = async (publication, properties) => {
  const { syndicationTargets } = publication;
  const syndicateTo = properties["mp-syndicate-to"];
  const syndicateToUrls = Array.isArray ? syndicateTo : [syndicateTo];
  const syndicatedUrls = properties.syndication || [];
  const failedTargets = [];

  for (const url of syndicateToUrls) {
    const target = getSyndicationTarget(syndicationTargets, url);
    const alreadySyndicated = hasSyndicationUrl(syndicatedUrls, url);

    if (target && !alreadySyndicated) {
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
