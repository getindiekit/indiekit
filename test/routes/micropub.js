const request = require('supertest');
const test = require('ava');
const app = require('../../app');

test('100: Create h-entry post (form-encoded)', async t => {
  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .send('h=entry&content=Micropub+test+of+creating+a+basic+h-entry');

  t.is(res.status, 202);
  t.deepEqual(res.body, {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating a basic h-entry']
    }
  });
  t.truthy(res.header.location);
});

test('101: Create h-entry post with multiple categories (form-encoded)', async t => {
  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .send('h=entry&content=Micropub+test+of+creating+an+h-entry+with+categories.+This+post+should+have+two+categories,+test1+and+test2&category[]=test1&category[]=test2');

  t.is(res.status, 202);
  t.deepEqual(res.body, {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating an h-entry with categories. This post should have two categories, test1 and test2'],
      category: ['test1', 'test2']
    }
  });
  t.truthy(res.header.location);
});

test('104: Create an h-entry with a photo referenced by URL (form-encoded)', async t => {
  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .send('h=entry&content=Micropub+test+of+creating+a+photo+referenced+by+URL&photo=https%3A%2F%2Fmicropub.rocks%2Fmedia%2Fsunset.jpg');

  t.is(res.status, 202);
  t.deepEqual(res.body, {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating a photo referenced by URL'],
      photo: ['https://micropub.rocks/media/sunset.jpg']
    }
  });
  t.truthy(res.header.location);
});

test('107: Create an h-entry post with one category (form-encoded)', async t => {
  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
    .send('h=entry&content=Micropub+test+of+creating+an+h-entry+with+one+category.+This+post+should+have+one+category,+test1&category=test1');

  t.is(res.status, 202);
  t.deepEqual(res.body, {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating an h-entry with one category. This post should have one category, test1'],
      category: ['test1']
    }
  });
  t.truthy(res.header.location);
});

test('200: Create an h-entry post (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating an h-entry with a JSON request']
    }
  };

  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/json')
    .send(JSON.stringify(mf2));

  t.is(res.status, 202);
  t.deepEqual(res.body, mf2);
  t.truthy(res.header.location);
});

test('201: Create an h-entry post with multiple categories (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating an h-entry with a JSON request containing multiple categories. This post should have two categories, test1 and test2.'],
      category: ['test1', 'test2']
    }
  };

  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/json')
    .send(JSON.stringify(mf2));

  t.is(res.status, 202);
  t.deepEqual(res.body, mf2);
  t.truthy(res.header.location);
});

test('202: Create an h-entry with HTML content (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: [{
        html: '<p>This post has <b>bold</b> and <i>italic</i> text.</p>'
      }]
    }
  };

  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/json')
    .send(JSON.stringify(mf2));

  t.is(res.status, 202);
  t.deepEqual(res.body, mf2);
  t.truthy(res.header.location);
});

test('203: Create an h-entry with a photo referenced by URL (JSON)', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Micropub test of creating a photo referenced by URL. This post should include a photo of a sunset.'],
      photo: ['https://micropub.rocks/media/sunset.jpg']
    }
  };

  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/json')
    .send(JSON.stringify(mf2));

  t.is(res.status, 202);
  t.deepEqual(res.body, mf2);
  t.truthy(res.header.location);
});

test('204: Create an h-entry post with a nested object (JSON)', async t => {
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

  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/json')
    .send(JSON.stringify(mf2));

  t.is(res.status, 202);
  t.deepEqual(res.body, mf2);
  t.truthy(res.header.location);
});

test('205: Create an h-entry post with a photo with alt text (JSON)', async t => {
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

  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/json')
    .send(JSON.stringify(mf2));

  t.is(res.status, 202);
  t.deepEqual(res.body, mf2);
  t.truthy(res.header.location);
});

test('206: Create an h-entry with multiple photos referenced by URL (JSON)', async t => {
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

  const res = await request(app)
    .post('/micropub')
    .set('Content-type', 'application/json')
    .send(JSON.stringify(mf2));

  t.is(res.status, 202);
  t.deepEqual(res.body, mf2);
  t.truthy(res.header.location);
});

test('600: Configuration Query', async t => {
  const res = await request(app)
    .get('/micropub')
    .query({q: 'config'});

  t.is(res.status, 200);
  t.truthy(res.body['media-endpoint']);
});

test('601: Syndication Endpoint Query', async t => {
  const res = await request(app)
    .get('/micropub')
    .query({q: 'syndicate-to'});

  t.is(res.status, 200);
  t.truthy(res.body['syndicate-to']);
});

test('603: Source Query (Specific Properties)', async t => {
  const res = await request(app)
    .get('/micropub')
    .query({
      q: 'source',
      properties: 'content',
      url: 'https://aaronpk.example/post/1000'
    });

  t.is(res.status, 404);
  t.truthy(res.body.error, 'not_supported');
});

test('6xx: Unknown Endpoint Query', async t => {
  const res = await request(app)
    .get('/micropub')
    .query({q: 'unknown'});

  t.is(res.status, 400);
  t.is(res.body.error, 'invalid_request');
});
