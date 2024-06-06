import makeDebug from "debug";

const debug = makeDebug(`indiekit:endpoint-syndicate:utils`);

/**
 * Get post data
 * @param {object} application - Application configuration
 * @param {string} url - URL of existing post (optional)
 * @returns {Promise<object>} Post data for given URL else recently published post
 */
export const getPostData = async (application, url) => {
  // It would be better to pass just the MongoDB posts collection and the URL as
  // arguments and avoid passing the entire Indiekit application object.
  const { posts } = application;
  let postData = {};

  if (url) {
    debug(
      `URL provided. Trying to find document matching this query in MongoDB posts collection`,
      {
        "properties.url": url,
      },
    );
    postData = await posts.findOne({
      "properties.url": url,
    });
    debug(`found MongoDB document %O`, postData);
  } else {
    debug(
      `URL not provided. Trying to find first document matching this query in MongoDB posts collection`,
      {
        "properties.mp-syndicate-to": {
          $exists: true,
        },
        "properties.syndication": {
          $exists: false,
        },
        "properties.post-status": {
          $ne: "draft",
        },
      },
    );
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

    debug(`found ${items.length} MongoDB documents`);
    postData = items[0]; // TODO: index out of bounds when there are no items
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
  // debug(`getSyndicationTarget %O`, { syndicationTargets, syndicateTo });
  return syndicationTargets.find((target) => {
    // target is an instance of an Indiekit syndicator
    debug(`getSyndicationTarget target %O`, target);
    if (!target?.info?.uid) {
      return;
    }

    debug(`syndication target ${target.name}`);
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
  debug(`mp-syndicate-to: ${syndicateToUrls.join(", ")}`);

  const syndicatedUrls = properties.syndication || [];
  const failedTargets = [];

  for (const url of syndicateToUrls) {
    const target = getSyndicationTarget(syndicationTargets, url);
    const alreadySyndicated = hasSyndicationUrl(syndicatedUrls, url);

    if (target && !alreadySyndicated) {
      try {
        debug(`try syndicating using ${target.name}`);
        const syndicatedUrl = await target.syndicate(properties, publication);

        // Add syndicated URL to list of syndicated URLs
        syndicatedUrls.push(syndicatedUrl);
        debug(`syndicated URL ${syndicatedUrl}`);
      } catch (error) {
        // Add failed syndication target to list of failed targets
        failedTargets.push(target.info.uid);
        debug(`failed to syndicate target %O`, target);
        console.error(error.message);
      }
    }
  }

  return {
    ...(failedTargets.length > 0 && { failedTargets }),
    syndicatedUrls,
  };
};
