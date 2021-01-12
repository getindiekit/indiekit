export const posts = {
  find: () => ({
    toArray: async () => ([{
      properties: {
        type: 'entry',
        'mp-syndicate-to': 'https://social.example/',
        url: `${process.env.TEST_PUBLICATION_URL}notes/2020/10/17/12345`
      }
    }])
  }),
  findOne: async () => ({
    properties: {
      type: 'entry',
      name: 'Item in database',
      published: '2020-10-17T19:41:39Z',
      url: `${process.env.TEST_PUBLICATION_URL}notes/2020/10/17/12345`,
      'mp-slug': '12345',
      'mp-syndicate-to': 'https://social.example/'
    }
  }),
  insertOne: async () => {},
  replaceOne: async () => {},
  updateOne: async () => {}
};
