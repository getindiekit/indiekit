export const Media = class {
  constructor(publication, mediaData) {
    this.publication = publication;
    this.mediaData = mediaData;
  }

  async upload(file) {
    const {media, store} = this.publication;
    const {mediaData} = this;

    try {
      const message = `${mediaData.type}: upload media`;
      const published = await store.createFile(mediaData.path, file.buffer, message);

      if (published) {
        mediaData.lastAction = 'upload';
        await media.set(mediaData.url, mediaData);
        return {
          location: mediaData.url,
          status: 201,
          success: 'create',
          description: `Media uploaded to ${mediaData.url}`
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
