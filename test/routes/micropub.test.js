const nock = require('nock');
const request = require('supertest');
const test = require('ava');

// Tests
test.before(t => {
  t.context.app = request(require(process.env.PWD + '/app/server'));
});

/**
 * Creating Posts (Form-Encoded)
 */
test('100: Create h-entry (form-encoded)', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send('h=entry&content=Micropub+test+of+creating+a+basic+h-entry');
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('101: Create h-entry with multiple categories (form-encoded)', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send('h=entry&content=Micropub+test+of+creating+an+h-entry+with+categories.+This+post+should+have+two+categories,+test1+and+test2&category[]=test1&category[]=test2');
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('104: Create h-entry with photo referenced by URL (form-encoded)', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send('h=entry&content=Micropub+test+of+creating+a+photo+referenced+by+URL&photo=https%3A%2F%2Fmicropub.rocks%2Fmedia%2Fsunset.jpg');
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('10x: Create h-entry with referenced photo and alt text (form-encoded)', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send('h=entry&content=Micropub+test+of+creating+a+photo+referenced+by+URL&photo=https%3A%2F%2Fmicropub.rocks%2Fmedia%2Fsunset.jpg&mp-photo-alt=Photo%20of%20a%20sunset');
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('10x: Create h-entry with multiple referenced photos and alt text (form-encoded)', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send('h=entry&content=Micropub+test+of+creating+a+photo+referenced+by+URL&photo[]=https%3A%2F%2Fmicropub.rocks%2Fmedia%2Fsunset.jpg&photo[]=https%3A%2F%2Fmicropub.rocks%2Fmedia%2Fcity-at-night.jpg&mp-photo-alt[]=Photo%20of%20a%20sunset&mp-photo-alt[]=Photo%20of%20a%20city%20at%20night');
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('107: Create h-entry with one category (form-encoded)', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send('h=entry&content=Micropub+test+of+creating+an+h-entry+with+one+category.+This+post+should+have+one+category,+test1&category=test1');
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

/**
 * Creating Posts (JSON)
 */
test('200: Create h-entry (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating an h-entry with a JSON request']
    }
  };
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send(JSON.stringify(mf2));
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('201: Create h-entry with multiple categories (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating an h-entry with a JSON request containing multiple categories. This post should have two categories, test1 and test2.'],
      category: ['test1', 'test2']
    }
  };
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send(JSON.stringify(mf2));
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('202: Create h-entry with HTML content (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: [{
        html: '<p>This post has <b>bold</b> and <i>italic</i> text.</p>'
      }]
    }
  };
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send(JSON.stringify(mf2));
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('203: Create h-entry with photo referenced by URL (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating a photo referenced by URL. This post should include a photo of a sunset.'],
      photo: ['https://micropub.rocks/media/sunset.jpg']
    }
  };
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send(JSON.stringify(mf2));
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('204: Create h-entry with nested object (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      published: ['2017-05-31T12:03:36-07:00'],
      content: ['Lunch meeting'],
      checkin: [{
        type: ['h-card'],
        properties: {
          name: ['Los Gorditos'],
          url: ['https://foursquare.com/v/502c4bbde4b06e61e06d1ebf'],
          latitude: [45.524330801154],
          longitude: [-122.68068808051],
          'street-address': ['922 NW Davis St'],
          locality: ['Portland'],
          region: ['OR'],
          'country-name': ['United States'],
          'postal-code': ['97209']
        }
      }]
    }
  };
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send(JSON.stringify(mf2));
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('205: Create h-entry with photo with alt text (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating a photo referenced by URL with alt text. This post should include a photo of a sunset.'],
      photo: [{
        value: 'https://micropub.rocks/media/sunset.jpg',
        alt: 'Photo of a sunset'
      }]
    }
  };
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send(JSON.stringify(mf2));
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('206: Create h-entry with multiple photos referenced by URL (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating multiple photos referenced by URL. This post should include a photo of a city at night.'],
      photo: [
        'https://micropub.rocks/media/sunset.jpg',
        'https://micropub.rocks/media/city-at-night.jpg'
      ]
    }
  };
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send(JSON.stringify(mf2));
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

/**
 * Deletes
 */
test.todo('500: Delete a post (form-encoded)');
test.todo('501: Delete a post (JSON)');
test.todo('502: Undelete a post (form-encoded)');
test.todo('503: Undelete a post (JSON)');

/**
 * Query
 */
test('600: Configuration Query', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .query({q: 'config'});
  t.is(response.status, 200);
  t.truthy(response.body['media-endpoint']);
});

test('601: Syndication Endpoint Query', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .query({q: 'syndicate-to'});
  t.is(response.status, 200);
  t.truthy(response.body['syndicate-to']);
});

test('603: Source Query (Specific Properties)', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .query({
      q: 'source',
      properties: 'name',
      url: 'https://paulrobertlloyd.com/2018/11/warp_and_weft'
    });
  t.is(response.status, 200);
  t.is(response.body.name[0], 'Warp and Weft');
});

test('6xx: Rejects unknown endpoint query', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .query({q: 'unknown'});
  t.is(response.status, 400);
  t.is(response.body.error, 'invalid_request');
});

/**
 * Authentication
 */
test('800: Accept access token in HTTP header', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .send('h=entry&content=Testing+accepting+access+token+in+HTTP+Authorization+header');
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test('801: Accept access token in POST body', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(201);
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .send(`h=entry&content=Testing+accepting+access+token+in+post+body&access_token=${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 201 && 202);
  t.truthy(response.header.location);
  scope.done();
});

test.todo('802: Does not store access token property');

test('803: Rejects unauthenticated requests', async t => {
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .send('h=entry&content=Testing+unauthenticated+request.+This+should+not+create+a+post.');
  t.is(response.status, 401);
});

test('804: Rejects unauthorized access tokens', async t => {
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN_NOT_SCOPED}`)
    .send('h=entry&content=Testing+a+request+with+an+unauthorized+access+token.+This+should+not+create+a+post.');
  t.is(response.status, 401);
});

test('8xx: Rejects invalid destination site', async t => {
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN_NOT_ME}`)
    .send('h=entry&content=Testing+a+request+with+invalid+access+token.+This+should+not+create+a+post.');
  t.is(response.status, 403);
});

test('8xx: Rejects invalid access tokens', async t => {
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('authorization', 'Bearer invalid')
    .send('h=entry&content=Testing+a+request+with+invalid+access+token.+This+should+not+create+a+post.');
  t.is(response.status, 401);
  t.is(response.body.error, 'unauthorized');
});
