import _ from 'lodash';

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

  // Then continue to base post type discovery
  if (_.has(properties, 'rsvp')) {
    return 'rsvp';
  }

  if (_.has(properties, 'in-reply-to')) {
    return 'reply';
  }

  if (_.has(properties, 'repost-of')) {
    return 'repost';
  }

  if (_.has(properties, 'bookmark-of')) {
    return 'bookmark';
  }

  if (_.has(properties, 'quotation-of')) {
    return 'quotation';
  }

  if (_.has(properties, 'like-of')) {
    return 'like';
  }

  if (_.has(properties, 'checkin')) {
    return 'checkin';
  }

  if (_.has(properties, 'listen-of')) {
    return 'listen';
  }

  if (_.has(properties, 'read-of')) {
    return 'read';
  }

  if (_.has(properties, 'watch-of')) {
    return 'watch';
  }

  if (_.has(properties, 'video')) {
    return 'video';
  }

  if (_.has(properties, 'audio')) {
    return 'audio';
  }

  if (_.has(properties, 'photo')) {
    return 'photo';
  }

  if (properties.children && Array.isArray(properties.children) && properties.children.length > 0) {
    return 'collection';
  }

  // Check that `name` value is not a prefix of processed `content` value
  let content = null;
  if (_.has(properties, 'content')) {
    content = properties.content.text || properties.content.html || properties.content;
  } else if (_.has(properties, 'summary')) {
    content = properties.summary;
  }

  if (_.has(properties, 'name') && _.has(properties, 'content')) {
    const name = properties.name.trim();
    if (!content.startsWith(name)) {
      return 'article';
    }
  }

  return 'note';
};
