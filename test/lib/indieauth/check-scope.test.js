const test = require('ava');

const checkScope = require(process.env.PWD + '/app/lib/indieauth/check-scope');

test('Returns true if required scope is provided by token', t => {
  const hasScope = checkScope('update', 'create update');
  t.true(hasScope);
});

test('Returns true if required scope is `create` but token provides `post`', t => {
  const hasScope = checkScope('create', 'post');
  t.true(hasScope);
});

test('Returns true if required scope is `post` but token provides `create`', t => {
  const hasScope = checkScope('post', 'create');
  t.true(hasScope);
});

test('Throws error if no scope provided in access token', t => {
  const error = t.throws(() => {
    checkScope('delete', null);
  });
  t.is(error.message.error_description, 'Access token does not provide any scope(s)');
});

test('Throws error if required scope not provided', t => {
  const error = t.throws(() => {
    checkScope(null, 'create update');
  });
  t.is(error.message.error_description, 'No scope was provided in request');
});

test('Throws error if required scope not provided by access token', t => {
  const error = t.throws(() => {
    checkScope('delete', 'create update');
  });
  t.is(error.message.error_description, 'Access token does not meet requirements for requested scope (delete)');
});
