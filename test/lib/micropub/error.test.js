const test = require('ava');

// Function
const micropub = require(process.env.PWD + '/app/lib/micropub');

// Tests
test('Returns 404 code if error name `not_found`', t => {
  const obj = micropub.error('not_found');
  t.is(obj.code, 404);
  t.truthy(obj.body.error_description);
});

test('Returns 403 code if error name `forbidden`', t => {
  const obj = micropub.error('forbidden');
  t.is(obj.code, 403);
  t.truthy(obj.body.error_description);
});

test('Returns 401 code if error name `unauthorized`', t => {
  const obj = micropub.error('unauthorized');
  t.is(obj.code, 401);
  t.truthy(obj.body.error_description);
});

test('Returns 401 code if error name `insufficient_scope`', t => {
  const obj = micropub.error('insufficient_scope');
  t.is(obj.code, 401);
  t.truthy(obj.body.error_description);
});

test('Returns 400 code if error name `invalid_request`', t => {
  const obj = micropub.error('invalid_request');
  t.is(obj.code, 400);
  t.truthy(obj.body.error_description);
});

test('Returns 500 code if no error name provided', t => {
  const obj = micropub.error();
  t.is(obj.code, 500);
  t.truthy(obj.body.error_description);
});
