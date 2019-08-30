const camelcaseKeys = require('camelcase-keys');
const derivePostType = require('post-type-discovery');

const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/lib/github');
const microformats = require(process.env.PWD + '/lib/microformats');
const publication = require(process.env.PWD + '/lib/publication');
const render = require(process.env.PWD + '/lib/render');
const store = require(process.env.PWD + '/lib/store');
const utils = require(process.env.PWD + '/lib/utils');

/**
 * Creates a post file.
 *
 * @exports create
 * @param {Object} req Request
 * @param {Object} options Options
 * @returns {String} Location of created file
 */
module.exports = async (req, options) => {
  options = options || {};
  const mf2 = options.mf2 || req.is('json') ? req.body : microformats.formEncodedToMf2(req.body);
  const {pub} = req.app.locals;

  // Derive type
  const type = derivePostType(mf2);

  // Get type config
  const typeConfig = pub['post-types'][type];

  // Derive properties
  const {properties} = mf2;
  properties.content = microformats.deriveContent(mf2);
  properties.photo = await microformats.derivePhoto(mf2);
  properties.published = microformats.derivePuplished(mf2);
  properties.slug = microformats.deriveSlug(mf2, pub['slug-separator']);

  // Get template
  const template = await publication.getPostTypeTemplate(typeConfig);

  // Render publish path and public url
  const path = render(typeConfig.post.path, properties);
  let url = render(typeConfig.post.url, properties);
  url = utils.derivePermalink(config.pub.url, url);

  // Render content
  const content = render(template, camelcaseKeys(properties));

  // Create record
  const postData = {
    post: {
      type,
      path,
      url
    },
    mf2: {
      type: ['h-entry'],
      properties
    }
  };

  // Upload post file to GitHub
  const response = await github.createFile(path, content, {
    message: req.__mf('{icon} %s created\nwith {app}', req.__(`post.${type}`), {
      app: config.name,
      icon: typeConfig.icon
    })
  });

  if (response) {
    store.set(url, postData);
    return postData;
  }
};
