const fs = require('fs-extra');
const nock = require('nock');
const test = require('ava');

const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/lib/post');

const outputDir = process.env.PWD + '/.ava_output/post-delete';

test.before(() => {
  config.data.dir = outputDir;
});

test('Deletes a post', async t => {
  // Mock GitHub delete file request
  const scope = nock('https://api.github.com')
    .get(/[\d\w]{5}/g)
    .reply(200, {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b'
    })
    .delete(/[\d\w]{5}/g)
    .reply(200, {
      content: 'Zm9vYmFy',
      commit: {
        message: `Delete message\nwith ${config.name}`
      }
    });

  const postData = {
    post: {
      path: '_notes/2019/08/11/gvsxa'
    }
  };
  const response = await post.delete(postData);

  // Test assertions
  t.true(response);
  scope.done();
});

test.after(async () => {
  await fs.emptyDir(outputDir);
});
