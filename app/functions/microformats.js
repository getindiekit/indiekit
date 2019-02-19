const validUrl = require('valid-url');

/**
 * Gets the plain text value from a value mf2 field.
 *
 * @private
 * @param {Array|Object} value Item from which value needs to be extracted
 * @return {String} Extracted value
 */
const getValue = function (value) {
  return value[0].value || value[0];
};

/**
 * Strips the content and name of non-alphanumeric characters and
 * checks if the content includes the name.
 *
 * @private
 * @param {String} name Name property of the item
 * @param {String} content Content property of the item
 * @return {Boolean} Whether the content includes the name
 */
const contentIncludesName = function (name, content) {
  const trimmedName = name.replace(/\W+/g, ' ');
  const trimmedContent = content.replace(/\W+/g, ' ');
  return (trimmedContent.indexOf(trimmedName) !== -1);
};

/**
 * Takes a microformats2 object and discovers its post type.
 * Adapted from https://github.com/twozeroone/post-type-discovery
 *
 * @param {Object} mf2 microformats2 object to be checked
 * @return {String} Type of post
 */
exports.getType = function (mf2) {
  const prop = mf2.properties;
  const propNames = Object.keys(prop);

  // RSVP
  if (
    propNames.includes('rsvp') && (
      prop.rsvp.includes('yes') ||
      prop.rsvp.includes('no') ||
      prop.rsvp.includes('maybe') ||
      prop.rsvp.includes('interested')
    )
  ) {
    return 'rsvp';
  }

  // Properties that need to have a valid URL
  const propToType = {
    'in-reply-to': 'reply',
    'repost-of': 'repost',
    'like-of': 'like',
    video: 'video',
    photo: 'photo'
  };

  const matches = Object.keys(propToType).filter(propName => {
    return (
      propNames.includes(propName) &&
      validUrl.isUri(getValue(prop[propName]))
    );
  });

  if (matches.length > 0) {
    return propToType[matches[0]];
  }

  // Are content and name the same?
  const name = prop.name ? getValue(prop.name) : undefined;
  const content = getValue(prop.content) || getValue(prop.summary);

  if (
    content !== undefined &&
    name !== undefined &&
    !contentIncludesName(name, content)
  ) {
    return 'article';
  }

  return 'note';
};
