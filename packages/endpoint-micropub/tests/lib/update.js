import test from 'ava';
import {
  addProperties,
  deleteEntries,
  deleteProperties,
  replaceEntries
} from '../../lib/update.js';

test.beforeEach(t => {
  t.context.jf2 = {
    content: 'hello world',
    published: '2019-08-17T23:56:38.977+01:00',
    category: ['foo', 'bar'],
    slug: 'baz'
  };
});

test('Adds property', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime'
  };
  const result = addProperties(jf2, {
    syndication: ['http://website.example']
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Lunchtime',
    syndication: 'http://website.example'
  });
});

test('Adds value to existing property', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime',
    category: 'foo'
  };
  const result = addProperties(jf2, {
    category: ['bar']
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Lunchtime',
    category: ['foo', 'bar']
  });
});

test('Deletes individual entries for properties of an object', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime',
    category: ['foo', 'bar']
  };
  const result = deleteEntries(jf2, {
    category: ['foo']
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Lunchtime',
    category: ['bar']
  });
});

test('Deletes individual entries for properties of an object (removing property if last entry removed)', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime',
    category: ['foo', 'bar']
  };
  const result = deleteEntries(jf2, {
    category: ['foo', 'bar']
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Lunchtime'
  });
});

test('Deletes individual entries for properties of an object (ignores properties that don’t exist)', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime',
    category: ['foo', 'bar']
  };
  const result = deleteEntries(jf2, {
    tags: ['foo', 'bar']
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Lunchtime',
    category: ['foo', 'bar']
  });
});

test('Throws error if requested deletion is not an array', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime'
  };
  const error = t.throws(() => deleteEntries(jf2, {
    category: 'foo'
  }));
  t.is(error.message, 'category should be an array');
});

test('Deletes property', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime',
    category: ['foo', 'bar']
  };
  const result = deleteProperties(jf2, ['category']);
  t.deepEqual(result, {
    type: 'entry',
    name: 'Lunchtime'
  });
});

test('Replaces property value', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime'
  };
  const result = replaceEntries(jf2, {
    name: ['Dinnertime']
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Dinnertime'
  });
});

test('Replaces property value (adding property if doesn’t exist)', t => {
  const jf2 = {
    type: 'entry',
    name: 'Lunchtime'
  };
  const result = replaceEntries(jf2, {
    content: ['I ate a cheese sandwich']
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Lunchtime',
    content: 'I ate a cheese sandwich'
  });
});
