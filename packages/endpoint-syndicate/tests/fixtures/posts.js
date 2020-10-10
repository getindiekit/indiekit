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
      'mp-syndicate-to': 'https://social.example/',
      url: 'https://paulrobertlloyd.github.io/indiekit-sandbox/notes/2020/10/17/12345'
    },
    mf2: {
      type: ['h-entry'],
      properties: {
        slug: ['12345'],
        published: ['2020-10-17T19:41:39Z'],
        'mp-syndicate-to': ['https://social.example/']
      }
    }
  }),
  replaceOne: async () => {}
};
