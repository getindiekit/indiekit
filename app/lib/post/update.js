const {IndieKitError} = require(process.env.PWD + '/app/errors');

/**
 * Updates a post
 *
 * @memberof post
 * @module update
 * @param {Object} recordData Post to delete
 */
module.exports = recordData => {
  throw new IndieKitError({
    error: 'action_not_supported',
    error_description: `Cannot update ${recordData.post.path}`
  });
};
