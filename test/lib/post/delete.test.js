const fs = require('fs-extra');
const nock = require('nock');
const test = require('ava');

const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/app/lib/post');
const record = require(process.env.PWD + '/app/lib/record');
const pub = require('./fixtures/create-config');

const outputDir = process.env.PWD + '/.ava_output/post-delete';

test.before(() => {
  config.data.dir = outputDir;
});

test.skip('Deletes a post', async t => {
  // Mock GitHub create file request
  const createScope = nock('https://api.github.com')
    .put(/\bwatched-isle-of-dogs\b/g)
    .reply(200);

  // Create post
  const body = require('./fixtures/type-note');
  const location = await post.create(pub, body);
  createScope.done();

  // Mock GitHub delete file request
  const deleteScope = nock('https://api.github.com')
    .get(/\bwatched-isle-of-dogs\b/g)
    .reply(200, {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b'
    })
    .delete(/\bwatched-isle-of-dogs\b/g)
    .reply(200, {
      content: null,
      commit: {
        message: `Delete message\nwith ${config.name}`
      }
    });

  // Create post
  const recordData = record.get(location);
  const response = await post.delete(recordData);

  // Test assertions
  t.true(response);
  deleteScope.done();
});

test.after(async () => {
  await fs.remove(outputDir);
});
