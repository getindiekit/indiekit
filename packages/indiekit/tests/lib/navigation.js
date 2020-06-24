import test from 'ava';

import {getNavigation} from '../../lib/navigation.js';

test('Returns logged out navigation', t => {
  const result = getNavigation({locale: 'en'}, false);
  t.is(result[0].href, '/docs/en');
  t.is(result[1].href, '/session/login');
});

test('Returns logged in navigation', t => {
  const result = getNavigation({locale: 'en'}, true);
  t.is(result[0].href, '/docs/en');
  t.is(result[1].href, '/session/logout');
});
