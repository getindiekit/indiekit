/**
 * Discover the post type from a mf2 json object.
 *
 * @memberof microformats
 * @module postType
 * @param {object} post A mf2 json object
 * @return {String} Type of post
 */
module.exports = post => { /* eslint complexity: 0 */
  const {properties} = post;

  if (properties.rsvp) {
    return 'rsvp';
  }

  if (properties['in-reply-to']) {
    if (properties.content && properties.content[0]) {
      let content = properties.content[0];
      if (typeof content !== 'string') {
        content = content.value || content.html;
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
