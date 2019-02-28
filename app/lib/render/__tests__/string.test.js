const test = require('ava');

// Functions
const render = require(process.env.PWD + '/app/lib/render');

// Tests
test('Renders a template string using context data', t => {
  const template = '{{ name }} walks into {{ location }}';
  const context = {
    name: 'Foo',
    location: 'Bar'
  };
  t.is(render(template, context), 'Foo walks into Bar');
});

test('Renders a template string with a date using context data', t => {
  const template = 'Published {{ published | date(\'DDD\') }}';
  const context = {
    name: 'Foo',
    published: '2019-02-27'
  };
  t.is(render(template, context), 'Published 27 February 2019');
});

test('Throws error if required context data is missing', t => {
  const template = 'Published {{ published }}';
  const context = {
    name: 'Foo'
  };
  const error = t.throws(() => {
    render()(template, context);
  });
  t.is(error.message, 'src must be a string or an object describing the source');
});
