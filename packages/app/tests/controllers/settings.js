import test from 'ava';

import * as settingsController from '../../controllers/settings.js';

test('Read a setting', async t => {
  const result = await settingsController.read();
  t.is(result.name, 'IndieKit');
});
