import test from 'ava';

import {markdown} from '../../filters/markdown.js';

test('Renders Markdown string as HTML', t => {
  const block = markdown('**bold**');
  const inline = markdown('**bold**', 'inline');
  t.is(block, '<p><strong>bold</strong></p>\n');
  t.is(inline, '<strong>bold</strong>');
});
