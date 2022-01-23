const test = require('ava');

const {icon} = require('../../../lib/nunjucks/globals.js');

test('Renders SVG icon', t => {
  const result = icon('note');

  t.regex(result, /^<svg class="icon" xmlns="http:\/\/www.w3.org\/2000\/svg"/);
});
