import test from 'ava';
import {Indiekit} from '@indiekit/indiekit';
import {FtpStore} from '../../index.js';

const ftp = new FtpStore({
  host: 'ftp.server.example',
  user: 'username',
  password: 'password',
  repo: 'repo',
});

test.beforeEach(t => {
  t.context.bitbucketUrl = 'https://api.bitbucket.org';
});

test('Gets plug-in info', t => {
  t.is(ftp.name, 'FTP store');
  t.is(ftp.info.name, 'username on ftp.server.example');
  t.is(ftp.info.uid, 'sftp://ftp.server.example/');
});

test('Initiates plug-in', t => {
  const indiekit = new Indiekit();
  ftp.init(indiekit);

  t.is(indiekit.publication.store.info.name, 'username on ftp.server.example');
});
