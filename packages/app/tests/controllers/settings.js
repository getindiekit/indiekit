import test from 'ava';

import {read as settings} from '../../controllers/settings.js';

test('Read a setting', async t => {
  const result = await settings;
  t.is(result.name, 'IndieKit');
});
