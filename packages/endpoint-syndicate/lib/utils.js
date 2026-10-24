/**
 * Syndication target, as used to syndicate a post
 *
 * `syndicate` is a method signature, so that targets whose `syndicate`
 * accepts a full publication configuration are also accepted
 * @typedef {{
 *   info: {
 *    name?: string,
 *    uid?: string
 *   },
 *   syndicate(
 *     properties: Jf2Properties,
 *     publication: SyndicationPublication,
 *   ): Promise<string|undefined>,
 * }} SyndicationTarget
 */

/**
 * Publication, as used to syndicate a post
 * @typedef {object} SyndicationPublication
 * @property {SyndicationTarget[]} syndicationTargets - Syndication targets
 */

/**
 * Result of syndicating a post to its targets
 * @typedef {object} SyndicationResult
 * @property {string[]} [failedTargets] - Targets that didn’t return a URL
 * @property {string[]} syndicatedUrls - Syndicated URLs
 */

/**
 * Get every post awaiting syndication
 *
 * A post is awaiting syndication while `mp-syndicate-to` remains: it is
 * deleted once every target has returned a URL, and replaced with the
 * targets that failed otherwise. Posts already syndicated to some of their
 * targets are therefore still awaiting the rest, and `syndicateToTargets`
 * skips the ones already done. Oldest first, so a backlog is syndicated in
 * the order it was published.
 * @param {Collection} postsCollection - Posts database collection
 * @returns {Promise<Jf2PostData[]>} Post data, oldest first
 */
export const getPostsAwaitingSyndication = async (postsCollection) => {
  const posts = await postsCollection
    .find({
      "properties.mp-syndicate-to": {
        $exists: true,
      },
      "properties.post-status": {
        $ne: "draft",
      },
    })
    .sort({ "properties.published": 1 })
    .toArray();

  return /** @type {Jf2PostData[]} */ (/** @type {unknown} */ (posts));
};

/**
 * Get post data
 * @param {Collection} postsCollection - Posts database collection
 * @param {string} [url] - URL of existing post
 * @returns {Promise<Jf2PostData|null|undefined>} Post data for given URL else oldest post awaiting syndication
 */
export const getPostData = async (postsCollection, url) => {
  if (url) {
    const post = await postsCollection.findOne({
      "properties.url": url,
    });

    return /** @type {Jf2PostData|null} */ (/** @type {unknown} */ (post));
  }

  const [oldest] = await getPostsAwaitingSyndication(postsCollection);
  return oldest;
};

/**
 * Check if target already returned a syndication URL
 * @param {string[]} syndicatedUrls - Syndication URLs
 * @param {string} syndicateTo - Syndication target
 * @returns {boolean} Target returned a syndication URL
 */
export const hasSyndicationUrl = (syndicatedUrls, syndicateTo) => {
  return syndicatedUrls.some((url) => {
    // `syndication` is stored as given, so may hold values that aren’t URLs
    if (!URL.canParse(url)) {
      return false;
    }

    const { origin } = new URL(url);
    return syndicateTo.includes(origin);
  });
};

/**
 * Get syndication target for syndication URL
 * @template {{info: { ame?: string, uid?: string}}} Target
 * @param {Target[]} syndicationTargets - Publication syndication targets
 * @param {string} syndicateTo - Syndication URL
 * @returns {Target|undefined} Publication syndication target
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
 * @param {SyndicationPublication} publication - Publication configuration
 * @param {Jf2Properties} properties - JF2 properties
 * @returns {Promise<SyndicationResult>} Syndicated URLs and any failed targets
 */
export const syndicateToTargets = async (publication, properties) => {
  const { syndicationTargets } = publication;
  const syndicateTo = properties["mp-syndicate-to"];
  const syndicateToUrls = Array.isArray(syndicateTo)
    ? syndicateTo
    : [syndicateTo];
  /**
   * @type {string[]}
   */
  const syndicatedUrls = properties.syndication || [];
  /**
   * @type {string[]}
   */
  const failedTargets = [];

  for (const url of syndicateToUrls) {
    const target = getSyndicationTarget(syndicationTargets, url);
    const uid = target?.info.uid;
    const alreadySyndicated = hasSyndicationUrl(syndicatedUrls, url);

    // `getSyndicationTarget` only returns a target with a `uid`
    if (target && uid && !alreadySyndicated) {
      try {
        const syndicatedUrl = await target.syndicate(properties, publication);

        if (syndicatedUrl) {
          // Add syndicated URL to list of syndicated URLs
          syndicatedUrls.push(syndicatedUrl);
        } else {
          // Add failed syndication target to list of failed targets
          failedTargets.push(uid);
        }
      } catch (error) {
        // Add failed syndication target to list of failed targets
        failedTargets.push(uid);
        console.error(error);
      }
    }
  }

  return {
    ...(failedTargets.length > 0 && { failedTargets }),
    syndicatedUrls,
  };
};

/**
 * @import { Collection } from "mongodb"
 */
