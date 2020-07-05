import test from 'ava';
import {checkScope} from '../../lib/scope.js';

test('Returns true if `create` scope is provided by token', t => {
  const result = checkScope('create');
  t.true(result);
});

test('Returns true if `media` scope is provided by token', t => {
  const result = checkScope('media');
  t.true(result);
});

test('Returns true if `create media` scope is provided by token', t => {
  const result = checkScope('create media');
  t.true(result);
});

test('Required scope defaults to `media`', t => {
  const result = checkScope('media', null);
  t.true(result);
});

test('Throws error if required scope not provided by access token', t => {
  const error = t.throws(() => {
    checkScope('post');
  });
  t.is(error.status, 401);
  t.is(error.message, 'Access token does not meet requirements for requested scope (create or media)');
});
