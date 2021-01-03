export const posts = {
  find: () => ({
    toArray: async () => ([{
      properties: {
        'mp-syndicate-to': 'https://social.example/',
        url: 'https://paulrobertlloyd.github.io/indiekit-sandbox/notes/2020/10/17/12345'
      }
    }])
  }),
  findOne: async () => ({
    properties: {
      name: 'Item in database',
      slug: '12345',
      published: '2020-10-17T19:41:39Z',
      url: 'https://paulrobertlloyd.github.io/indiekit-sandbox/notes/2020/10/17/12345',
      'mp-syndicate-to': 'https://social.example/'
    },
    mf2: {
      type: ['h-entry'],
      properties: {
        name: ['Item in database'],
        slug: ['12345'],
        published: ['2020-10-17T19:41:39Z'],
        url: ['https://paulrobertlloyd.github.io/indiekit-sandbox/notes/2020/10/17/12345'],
        'mp-syndicate-to': ['https://social.example/']
      }
    }
  }),
  replaceOne: async () => {}
};
