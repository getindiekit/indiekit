const test = require('ava');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');

test('Throws errror', t => {
  const fn = () => {
    throw new IndieKitError({
      error: 'teapot',
      error_description: 'I’m a teapot'
    });
  };

  const error = t.throws(() => {
    fn();
  }, IndieKitError);

  t.is(error.message.error, 'teapot');
  t.is(error.message.error_description, 'I’m a teapot');
});
