import test from 'ava';
import errorListService from '../../services/error-list.js';

test('Returns errors in a list can use in templates', t => {
  const errors = {
    me: {
      value: 'foo',
      msg: 'Enter a valid URL',
      param: 'customConfigUrl',
      location: 'body'
    }
  };
  const result = errorListService(errors);
  t.is(result[0].href, '#custom-config-url');
  t.is(result[0].text, 'Enter a valid URL');
});
