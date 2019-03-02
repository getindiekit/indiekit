const test = require('ava');

// Function
const micropub = require(process.env.PWD + '/app/lib/micropub');

// Tests
test('Returns 201 code if succces name is `create`', t => {
  const obj = micropub.response('create');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 202 code if succces name is `create_pending`', t => {
  const obj = micropub.response('create_pending');
  t.is(obj.code, 202);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if succces name is `update`', t => {
  const obj = micropub.response('update');
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});

test('Returns 201 code if succces name is `update_created`', t => {
  const obj = micropub.response('update_created');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if succces name is `delete`', t => {
  const obj = micropub.response('delete');
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});

test('Returns 201 code if succces name is `delete_undelete`', t => {
  const obj = micropub.response('delete_undelete');
  t.is(obj.code, 201);
  t.truthy(obj.body.success_description);
});

test('Returns 200 code if no success name provided', t => {
  const obj = micropub.response();
  t.is(obj.code, 200);
  t.truthy(obj.body.success_description);
});
