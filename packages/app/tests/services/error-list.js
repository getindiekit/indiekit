import test from 'ava';
import {errorList} from '../../services/error-list.js';

test('Transforms errors into format that can be used in templates', t => {
  const errors = {
    me: {
      value: 'foo',
      msg: 'Enter a valid URL',
      param: 'customConfigUrl',
      location: 'body'
    }
  };
  const result = errorList(errors);
  t.is(result[0].href, '#custom-config-url');
  t.is(result[0].text, 'Enter a valid URL');
});
