const test = require('ava');

const devivePostType = require(process.env.PWD + '/app/lib/microformats/derive-post-type.js');

test('Derives note', t => {
  const note = require('./fixtures/post-type-note');
  t.is(devivePostType(note), 'note');
});

test('Derives bookmark from `bookmark-of` property', t => {
  const bookmark = require('./fixtures/post-type-bookmark');
  t.is(devivePostType(bookmark), 'bookmark');
});

test('Derives checkin from `checkin` property', t => {
  const checkin = require('./fixtures/post-type-checkin');
  t.is(devivePostType(checkin), 'checkin');
});

test('Derives event from `start` property', t => {
  const event = require('./fixtures/post-type-event');
  t.is(devivePostType(event), 'event');
});
