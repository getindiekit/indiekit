const test = require('ava');

const getPostTypeTemplate = require(process.env.PWD + '/lib/publication/get-post-type-template.js');

test('Throws error if cached template not found', async t => {
  // Setup
  const postTypeConfig = {
    type: 'note',
    name: 'Note',
    template: {
      cacheKey: 'foo.njk'
    }
  };

  const error = await t.throwsAsync(getPostTypeTemplate(postTypeConfig));

  // Test assertions
  t.is(error.message, 'Key `foo.njk` not found');
});
