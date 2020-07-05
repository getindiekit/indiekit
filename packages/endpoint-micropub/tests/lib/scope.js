import test from 'ava';
import {checkScope} from '../../lib/scope.js';

test('Returns true if required scope is provided by token', t => {
  const result = checkScope('create update', 'update');
  t.true(result);
});

test('Returns true if required scope is `create` but token provides `post`', t => {
  const result = checkScope('post', 'create');
  t.true(result);
});

test('Required scope defaults to `create`', t => {
  const result = checkScope('create update', null);
  t.true(result);
});

test('Requested scope defaults to `create` if none provided by access token', t => {
  const result = checkScope(null, 'create');
  t.true(result);
});

test('Throws error if required scope not provided by access token', t => {
  const error = t.throws(() => {
    checkScope('create update', 'delete');
  });
  t.is(error.status, 401);
  t.is(error.message, 'Access token does not meet requirements for requested scope (delete)');
});
