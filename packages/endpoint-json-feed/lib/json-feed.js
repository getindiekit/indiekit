import mime from "mime-types";

/**
 * Generate JSON Feed
 * @param {object} application - Application configuration
 * @param {string} feedUrl - Feed URL
 * @param {object} posts - JF2 posts
 * @returns {object} JSON Feed
 */
export const jsonFeed = (application, feedUrl, posts) => ({
  version: "https://jsonfeed.org/version/1.1",
  title: application.name,
  home_page_url: application.url,
  feed_url: feedUrl,
  language: application.locale,
  items: posts.map(({ properties }) => {
    const {
      url,
      published,
      name,
      summary,
      content,
      category,
      audio,
      photo,
      video,
    } = properties;

    const external_url = properties["bookmark-of"] || properties["in-reply-to"];

    const attachments = [...(audio || []), ...(photo || []), ...(video || [])];

    return {
      id: url,
      url,
      date_published: published,
      ...(name && { title: name }),
      ...(summary && { summary }),
      ...(content && {
        content_html: content.html,
        content_text: content.text,
      }),
      ...(category && {
        tags: Array.isArray(category) ? category : [category],
      }),
      ...(external_url && { external_url }),
      ...(attachments.length > 0 && {
        attachments: attachments.map((attachment) => ({
          url: attachment.url,
          title: attachment.alt,
          mime_type: mime.lookup(attachment.url),
        })),
      }),
    };
  }),
});
