const test = require('ava');

// Functions
const utils = require(process.env.PWD + '/app/lib/utils');

// Tests
test('Generates random alpha-numeric string, 5 characters long', t => {
  t.regex(utils.createRandomString(), /[\d\w]{5}/g);
});

test('Decodes form-encoded string', t => {
  t.false(utils.decodeFormEncodedString({foo: 'bar'}));
  t.is(utils.decodeFormEncodedString('foo+bar'), 'foo bar');
  t.is(utils.decodeFormEncodedString('http%3A%2F%2Ffoo.bar'), 'http://foo.bar');
});

test('Derives file type and returns equivalent IndieWeb post type', t => {
  t.is(utils.deriveMediaType('audio/mp3'), 'audio');
  t.is(utils.deriveMediaType('video/mp4'), 'video');
  t.is(utils.deriveMediaType('image/jpeg'), 'photo');
});

test('Returns 404 code if error name `not_found`', t => {
  const obj = utils.error('not_found');
  t.is(obj.code, 404);
  t.truthy(obj.body.error_description);
});

test('Returns 403 code if error name `forbidden`', t => {
  const obj = utils.error('forbidden');
  t.is(obj.code, 403);
  t.truthy(obj.body.error_description);
});

test('Returns 401 code if error name `unauthorized`', t => {
  const obj = utils.error('unauthorized');
  t.is(obj.code, 401);
  t.truthy(obj.body.error_description);
});

test('Returns 401 code if error name `insufficient_scope`', t => {
  const obj = utils.error('insufficient_scope');
  t.is(obj.code, 401);
  t.truthy(obj.body.error_description);
});

test('Returns 400 code if error name `invalid_request`', t => {
  const obj = utils.error('invalid_request');
  t.is(obj.code, 400);
  t.truthy(obj.body.error_description);
});

test('Returns 500 code if no error name provided', t => {
  const obj = utils.error();
  t.is(obj.code, 500);
  t.truthy(obj.body.error_description);
});

test('Excerpts string', t => {
  const string = 'Foo bar baz qux quux.';
  t.is(utils.excerptString(string, 2), 'Foo bar');
  t.is(utils.excerptString(string, 10), 'Foo bar baz qux quux.');
});

test('Removes `/` from beginning and end of string', t => {
  t.is(utils.normalizePath('/foo/bar/'), 'foo/bar');
});

test('Returns 201 code if succces name is `create`', t => {
  const obj = utils.success('create');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 202 code if succces name is `create_pending`', t => {
  const obj = utils.success('create_pending');
  t.is(obj.code, 202);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if succces name is `update`', t => {
  const obj = utils.success('update');
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});

test('Returns 201 code if succces name is `update_created`', t => {
  const obj = utils.success('update_created');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if succces name is `delete`', t => {
  const obj = utils.success('delete');
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});

test('Returns 201 code if succces name is `delete_undelete`', t => {
  const obj = utils.success('delete_undelete');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if no success name provided', t => {
  const obj = utils.success();
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});
