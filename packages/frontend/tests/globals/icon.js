import test from 'ava';

import {icon} from '../../globals/icon.js';

test('Renders SVG icon', t => {
  const result = icon('note');
  t.regex(result, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
});
