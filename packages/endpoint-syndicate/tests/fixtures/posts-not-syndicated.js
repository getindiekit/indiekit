export const publication = {
  micropubEndpoint: '/micropub',
  posts: {
    findOne: async query => {
      if (query['properties.url'] === 'https://website.example/post') {
        return {
          'properties.url': 'https://website.example/post',
          properties: {
            type: 'entry',
            content: 'hello world',
            published: '2019-08-17T23:56:38.977+01:00',
            'mp-syndicate-to': 'https://social.example/',
            'post-type': 'note',
            url: 'https://website.example/post'
          }
        };
      }

      return false;
    }
  },
  syndicationTargets: [{
    name: 'Example social network',
    uid: 'https://social.example/'
  }]
};
