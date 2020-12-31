export const publication = {
  micropubEndpoint: '/micropub',
  posts: {
    findOne: async () => ({
      'properties.url': 'https://website.example/syndicated-post',
      properties: {
        content: 'hello world',
        published: '2019-08-17T23:56:38.977+01:00',
        syndication: 'https://social.example/status/1',
        'post-type': 'note',
        url: 'https://website.example/syndicated-post'
      },
      mf2: {
        type: ['h-entry'],
        properties: {
          content: ['hello world'],
          published: ['2019-08-17T23:56:38.977+01:00'],
          syndication: ['https://social.example/status/1']
        }
      }
    })
  },
  syndicationTargets: [{
    name: 'Example social network',
    uid: 'https://social.example/'
  }]
};
