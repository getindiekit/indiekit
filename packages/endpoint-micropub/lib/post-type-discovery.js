/**
 * Accepts a JF2 object and attempts to determine the post type
 *
 * @param {object} properties JF2 properties
 * @returns {string|null} The post type or null if unknown
 */
export const getPostType = properties => {
  if (properties.type !== 'entry') {
    return properties.type;
  }

  /**
   * Checks that the microformats object contains the givin property and it is not empty
   *
   * @param {string} property Property name to check for
   * @returns {boolean} True if exists and not empty
   */
  const propertyExists = property =>
    properties &&
    properties[property] &&
    typeof properties[property] !== 'undefined' &&
    properties[property] !== null &&
    properties[property] !== '';

  // Then continue to base post type discovery
  if (propertyExists('rsvp')) {
    return 'rsvp';
  }

  if (propertyExists('in-reply-to')) {
    return 'reply';
  }

  if (propertyExists('repost-of')) {
    return 'repost';
  }

  if (propertyExists('bookmark-of')) {
    return 'bookmark';
  }

  if (propertyExists('quotation-of')) {
    return 'quotation';
  }

  if (propertyExists('like-of')) {
    return 'like';
  }

  if (propertyExists('checkin')) {
    return 'checkin';
  }

  if (propertyExists('listen-of')) {
    return 'listen';
  }

  if (propertyExists('read-of')) {
    return 'read';
  }

  if (propertyExists('watch-of')) {
    return 'watch';
  }

  if (propertyExists('isbn')) {
    return 'book';
  }

  if (propertyExists('video')) {
    return 'video';
  }

  if (propertyExists('audio')) {
    return 'audio';
  }

  if (propertyExists('ate')) {
    return 'ate';
  }

  if (propertyExists('drank')) {
    return 'drank';
  }

  if (properties.children && Array.isArray(properties.children) && properties.children.length > 0) {
    return 'collection';
  }

  if (propertyExists('photo')) {
    return 'photo';
  }

  // Get the main content of the post
  let content = null;
  if (propertyExists('content')) {
    content = properties.content.text || properties.content.html || properties.content;
  } else if (propertyExists('summary')) {
    content = properties.summary;
  }

  if (propertyExists('name') && propertyExists('content')) {
    const name = properties.name.trim();
    if (!content.startsWith(name)) {
      return 'article';
    }
  }

  return 'note';
};
