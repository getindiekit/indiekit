/**
 * Parse microformats2 objects and determine their properties and type.
 *
 * @module functions/microformats
 */
const microformats = require('microformat-node');

const utils = require(__basedir + '/app/functions/utils');

/**
 * Discover the post type from a mf2 json object.
 *
 * @param {object} mf2 A mf2 json object
 * @return {String} Type of post
 */
const getType = post => {
  const {properties} = post;

  if (properties.rsvp) {
    return 'rsvp';
  }

  if (properties['in-reply-to']) {
    if (properties.content && properties.content[0]) {
      let content = properties.content[0];
      if (typeof content !== 'string') {
        if (content.value) {
          content = content.value;
        } else if (content.html) {
          content = content.html;
        }
      }
    }

    return 'reply';
  }

  if (properties['repost-of']) {
    return 'repost';
  }

  if (properties['bookmark-of']) {
    return 'bookmark';
  }

  if (properties['quotation-of']) {
    return 'quotation';
  }

  if (properties['like-of']) {
    return 'like';
  }

  if (properties.checkin) {
    return 'checkin';
  }

  if (properties['listen-of']) {
    return 'listen';
  }

  if (properties['read-of']) {
    return 'read';
  }

  if (properties.start) {
    return 'event';
  }

  if (
    properties['watch-of'] ||
    properties.show_name ||
    properties.movie_name
  ) {
    return 'watch';
  }

  if (properties.isbn) {
    return 'book';
  }

  if (properties.video) {
    return 'video';
  }

  if (properties.audio) {
    return 'audio';
  }

  if (properties.ate) {
    return 'ate';
  }

  if (properties.drank) {
    return 'drank';
  }

  if (post.children && Array.isArray(post.children)) {
    return 'collection';
  }

  if (properties.photo) {
    return 'photo';
  }

  if (properties.name && properties.name !== '') {
    return 'article';
  }

  return 'note';
};

/**
 * Parses microformats on HTML page.
 *
 * @param {String} html HTML marked up with microformats
 * @return {Object} mf2
 */
const getProperties = async html => {
  let mf2;
  const {items} = await microformats.getAsync({
    html: await html,
    textFormat: 'normalised'
  });

  if (items && items.length === 1) {
    const item = items[0];
    if (Object.keys(item.properties).length > 1) {
      const {html} = item.properties.content[0];
      if (html) {
        item.properties.content[0].html = utils.sanitizeHtml(html);
      }

      mf2 = item;
    }
  }

  return mf2;
};

module.exports = {
  getType,
  getProperties
};
