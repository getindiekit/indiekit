/**
 * Parse microformats2 objects and determine their properties and type.
 *
 * @module functions/microformats
 */
const validUrl = require('valid-url');
const microformats = require('microformat-node');

/**
 * Gets the plain text value from a value mf2 field.
 *
 * @private
 * @param {Array|Object} value Item from which value needs to be extracted
 * @return {String} Extracted value
 */
const getValue = value => {
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
const contentIncludesName = (name, content) => {
  const trimmedName = name.replace(/\W+/g, ' ');
  const trimmedContent = content.replace(/\W+/g, ' ');
  return (trimmedContent.indexOf(trimmedName) !== -1);
};

/**
 * Take a microformats2 object and determine its post type. Adapted from
 * {@link https://github.com/twozeroone/post-type-discovery post-type-discovery}
 * by {@link http://prtksxna.com Prateek Saxena}.
 *
 * @copyright Copyright (c) 2017, 201. All rights reserved.
 * @example getType({
 *   type: ['h-entry'],
 *   properties: {
 *     content: ['Foo bar']
 *   }
 * }) => 'note'
 * @param {Object} mf2 microformats2 object to be checked
 * @return {String} Type of post
 */
const getType = mf2 => {
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
      // @todo Recursively remove errant \n newlines from object value
      mf2 = item;
    }
  }

  return mf2;
};

module.exports = {
  getType,
  getProperties
};
