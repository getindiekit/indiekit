const test = require('ava');

// Function
const response = require('./../response');

// Tests
test('Returns 404 code if error name `not_found`', t => {
  const obj = response.error('not_found');
  t.is(obj.code, 404);
  t.truthy(obj.body.error_description);
});

test('Returns 403 code if error name `forbidden`', t => {
  const obj = response.error('forbidden');
  t.is(obj.code, 403);
  t.truthy(obj.body.error_description);
});

test('Returns 401 code if error name `unauthorized`', t => {
  const obj = response.error('unauthorized');
  t.is(obj.code, 401);
  t.truthy(obj.body.error_description);
});

test('Returns 401 code if error name `insufficient_scope`', t => {
  const obj = response.error('insufficient_scope');
  t.is(obj.code, 401);
  t.truthy(obj.body.error_description);
});

test('Returns 400 code if error name `invalid_request`', t => {
  const obj = response.error('invalid_request');
  t.is(obj.code, 400);
  t.truthy(obj.body.error_description);
});

test('Returns 500 code if no error name provided', t => {
  const obj = response.error();
  t.is(obj.code, 500);
  t.truthy(obj.body.error_description);
});

test('Returns 201 code if succces name is `create`', t => {
  const obj = response.success('create');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 202 code if succces name is `create_pending`', t => {
  const obj = response.success('create_pending');
  t.is(obj.code, 202);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if succces name is `update`', t => {
  const obj = response.success('update');
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});

test('Returns 201 code if succces name is `update_created`', t => {
  const obj = response.success('update_created');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if succces name is `delete`', t => {
  const obj = response.success('delete');
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});

test('Returns 201 code if succces name is `delete_undelete`', t => {
  const obj = response.success('delete_undelete');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if no success name provided', t => {
  const obj = response.success();
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});
