const path = require('path');
const {DateTime} = require('luxon');
const slugify = require('slugify');

const appConfig = require(__basedir + '/config.js');
const pubDefaults = appConfig.defaults;
const github = require(__basedir + '/lib/github');
const render = require(__basedir + '/lib/render');

/**
 * Derives a slug (based on microformats2 data, else a random number)
 *
 * @private
 * @param {Object} mf2 microformats2 object
 * @param {String} separator Slug separator
 * @returns {Array} Slug
 */
const getSlug = (mf2, separator) => {
  let slug;
  const hasSlug = ((mf2 || {}).mp || {}).slug;
  const hasTitle = ((mf2 || {}).properties || {}).name;

  if (hasSlug) {
    slug = mf2.mp.slug[0];
  }

  if (hasTitle) {
    slug = slugify(mf2.properties.name[0], {
      replacement: separator,
      lower: true
    });
  }

  slug = String(Math.floor(Math.random() * 90000) + 10000);

  return new Array(slug);
};

/**
 * Derives published date (based on microformats2 data, else the current date)
 *
 * @private
 * @param {Object} mf2 microformats2 object
 * @returns {Array} ISO formatted date
 */
const getDate = mf2 => {
  let date;

  try {
    const published = mf2.properties.published[0];
    date = published.toISO();
  } catch (error) {
    date = DateTime.local().toISO();
  }

  return new Array(date);
};

/**
 * Ensures photo property is consistently formatted as an array of objects
 *
 * @private
 * @param {Array} property microformats2 `photo` property
 * @returns {Array} Photos
 */
const getPhotos = property => {
  if (property) {
    const photo = [];

    property.forEach(item => {
      if (typeof item === 'object') {
        photo.push(item);
      } else {
        item = {value: item};
        photo.push(item);
      }
    });

    return photo;
  }

  return null;
};

/**
 * Derives content (HTML, else object value, else property value)
 *
 * @private
 * @param {Array} property microformats2 `contents` property
 * @returns {Array} Content
 */
const getContent = property => {
  if (property) {
    const content = property[0].html || property[0].value || property[0];
    return new Array(content);
  }

  return null;
};

/**
 * Generates post data by merging submitted and derived information about a post
 *
 * @memberof microformats
 * @module deriveData
 * @param {Object} pubConfig Publication configuration
 * @param {String} mf2 microformats2 object
 * @param {String} files File attachments
 * @returns {Promise} mf2 object
 */
module.exports = async (pubConfig, mf2, files) => {
  const {properties} = mf2;
  const slugSeparator = pubConfig['slug-separator'] || pubDefaults['slug-separator'];

  properties.content = getContent(properties.content);
  properties.photo = getPhotos(properties.photo);
  properties.published = getDate(mf2);
  properties.slug = getSlug(mf2, slugSeparator);

  if (files) {
    /**
     * Turns out async/await doesn’t work so great with forEach loops. Use
     * asynchronous `await Promise.all(files.map(async file => {…}))` or
     * synchronous `for (const file of files) {…}` instead.
     * (Asynchronous pattern trips up Micropub.rocks! validator)
     * @see https://stackoverflow.com/a/37576787/11107625
     */
    for (const file of files) { /* eslint-disable no-await-in-loop */
      const fileext = path.extname(file.originalname);
      let filename = String(Math.floor(Math.random() * 90000) + 10000);
      filename += fileext;

      // @todo Infer type by `type` using multer field object
      const typeConfig = pubConfig['post-types'][0].photo || pubDefaults['post-types'][0].photo;
      const fileProperties = {
        filetype: 'photo',
        filename,
        fileext
      };
      const fileContext = {...properties, ...fileProperties};
      const filePath = render(typeConfig.file, fileContext);

      const githubResponse = await github.createFile(filePath, file.buffer, {
        message: `:framed_picture: ${filename} uploaded with ${appConfig.name}`
      });

      if (githubResponse) {
        properties.photo = properties.photo || [];
        properties.photo.push({
          value: filePath
        });
      }
    } /* eslint-enable no-await-in-loop */

    return mf2;
  }

  return mf2;
};
