const test = require('ava');

const getPostTypes = require(process.env.PWD + '/app/lib/publication/get-post-types.js');

test('Returns array of post types if provided in object', async t => {
  const pub = {'post-types': {
    note: {
      type: 'note',
      name: 'Note'
    }
  }};
  const postTypes = await getPostTypes(pub);
  t.deepEqual(postTypes, [{type: 'note', name: 'Note'}]);
});

test('Returns empty array if no post types provided', async t => {
  const pub = {'post-types': null};
  const postTypes = await getPostTypes(pub);
  t.deepEqual(postTypes, []);
});
