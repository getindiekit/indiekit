import test from 'ava';

import publicationController from '../../controllers/publication.js';

test('Return publication configuration', async t => {
  const result = await publicationController();

  t.deepEqual(result.categories, []);
});
