import test from 'ava';

import * as publicationController from '../../controllers/publication.js';

test('Return publication configuration', async t => {
  const result = await publicationController.read();

  t.deepEqual(result.categories, []);
});
