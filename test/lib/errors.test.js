const test = require('ava');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');

test('Throws errror', t => {
  const fn = () => {
    throw new IndieKitError({
      error: 'Teapot',
      error_description: 'I’m a teapot'
    });
  };

  const error = t.throws(() => {
    fn();
  }, {instanceOf: IndieKitError});

  t.is(error.message.error, 'Teapot');
  t.is(error.message.error_description, 'I’m a teapot');
});
