const test = require('ava');

const indieauth = require(process.env.PWD + '/lib/indieauth');

test('Returns true if required scope is provided by token', t => {
  const hasScope = indieauth.checkScope('update', 'create update');
  t.true(hasScope);
});

test('Returns true if required scope is `create` but token provides `post`', t => {
  const hasScope = indieauth.checkScope('create', 'post');
  t.true(hasScope);
});

test('Returns true if required scope is `post` but token provides `create`', t => {
  const hasScope = indieauth.checkScope('post', 'create');
  t.true(hasScope);
});

test('Returns true if required scope not provided', t => {
  // Default required scope is `create`
  const hasScope = indieauth.checkScope(null, 'create');
  t.true(hasScope);
});

test('Returns true if create scope not provided in access token', t => {
  // Default token scope is `create`
  const hasScope = indieauth.checkScope('create', null);
  t.true(hasScope);
});

test('Throws error if required scope not provided in access token', t => {
  const error = t.throws(() => {
    indieauth.checkScope('delete', null);
  });
  t.is(error.message.error_description, 'Access token does not meet requirements for requested scope (delete)');
});

test('Throws error if required scope not provided by access token', t => {
  const error = t.throws(() => {
    indieauth.checkScope('delete', 'create update');
  });
  t.is(error.message.error_description, 'Access token does not meet requirements for requested scope (delete)');
});
