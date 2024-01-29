/**
 * Accepts a JF2 object and attempts to determine the post type
 * @param {object} postTypes - Configured post types
 * @param {object} properties - JF2 properties
 * @returns {string|null} The post type or null if unknown
 * @see {@link https://ptd.spec.indieweb.org/#algorithm}
 */
export const getPostType = (postTypes, properties) => {
  const propertiesMap = new Map(Object.entries(properties));

  // If post has the event type, it’s an event
  if (properties.type && properties.type === "event") {
    return properties.type;
  }

  const basePostTypes = new Map();

  // Types defined in Post Type Discovery specification
  basePostTypes.set("rsvp", "rsvp");
  basePostTypes.set("repost", "repost-of");
  basePostTypes.set("like", "like-of");
  basePostTypes.set("reply", "in-reply-to");
  basePostTypes.set("video", "video");
  basePostTypes.set("photo", "photo");

  // Types defined in post type configuration
  for (const [type, { discovery }] of Object.entries(postTypes)) {
    if (!discovery) {
      continue;
    }

    basePostTypes.set(type, discovery);
  }

  for (const basePostType of basePostTypes) {
    if (propertiesMap.has(basePostType[1])) {
      return basePostType[0];
    }
  }

  // If has `children` property that is populated, is collection type
  if (
    properties.children &&
    Array.isArray(properties.children) &&
    properties.children.length > 0
  ) {
    return "collection";
  }

  // Check that `name` value is not a prefix of processed `content` value
  let content;
  if (propertiesMap.has("content")) {
    content =
      properties.content.text || properties.content.html || properties.content;
  } else if (propertiesMap.has("summary")) {
    content = properties.summary;
  }

  // Check if post could be an article
  if (propertiesMap.has("name") && propertiesMap.has("content")) {
    const name = properties.name.trim();
    if (!content.startsWith(name)) {
      return "article";
    }
  }

  return "note";
};
