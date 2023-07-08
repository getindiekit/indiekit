/**
 * Accepts a JF2 object and attempts to determine the post type
 * @param {object} properties - JF2 properties
 * @returns {string|null} The post type or null if unknown
 */
export const getPostType = (properties) => {
  const propertiesMap = new Map(Object.entries(properties));

  // If already has a type that’s not entry, return that value
  if (properties.type && properties.type !== "entry") {
    return properties.type;
  }

  // Then continue to base post type discovery
  const basePostTypes = new Map();
  basePostTypes.set("rsvp", "rsvp");
  basePostTypes.set("in-reply-to", "reply");
  basePostTypes.set("repost-of", "repost");
  basePostTypes.set("bookmark-of", "bookmark");
  basePostTypes.set("quotation-of", "quotation");
  basePostTypes.set("like-of", "like");
  basePostTypes.set("checkin", "checkin");
  basePostTypes.set("listen-of", "listen");
  basePostTypes.set("read-of", "read");
  basePostTypes.set("watch-of", "watch");
  basePostTypes.set("video", "video");
  basePostTypes.set("audio", "audio");
  basePostTypes.set("photo", "photo");

  for (const basePostType of basePostTypes) {
    if (propertiesMap.has(basePostType[0])) {
      return basePostType[1];
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
