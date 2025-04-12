import markdownAnchor from "markdown-it-anchor";
import markdownDefList from "markdown-it-deflist";
import markdownFootnote from "markdown-it-footnote";
import markdownTaskLists from "markdown-it-task-lists";
import _package from "../../packages/indiekit/package.json" with { type: "json" };

const sidebar = [
  {
    text: "Introduction",
    items: [
      { text: "Get started", link: "/get-started" },
      { text: "How Indiekit works", link: "/introduction" },
      { text: "Core concepts", link: "/concepts" },
      { text: "Sponsors", link: "/sponsors" },
      { text: "Contributing", link: "/contributing" },
    ],
  },
  {
    text: "Configuration",
    items: [
      { text: "Introduction", link: "/configuration/" },
      { text: "Application options", link: "/configuration/application" },
      { text: "Publication options", link: "/configuration/publication" },
      { text: "Commit messages", link: "/configuration/commit-messages" },
      { text: "Localisation", link: "/configuration/localisation" },
      { text: "Post types", link: "/configuration/post-types" },
      { text: "Post template", link: "/configuration/post-template" },
      { text: "Time zone", link: "/configuration/time-zone" },
      { text: "Tokens", link: "/configuration/tokens" },
    ],
  },
  {
    text: "Resources",
    items: [
      { text: "Accessibility statement", link: "/accessibility" },
      { text: "Micropub clients", link: "/clients" },
      { text: "Supported specifications", link: "/specifications" },
      { text: "Local development", link: "/development" },
    ],
  },
];

const sidebarApi = [
  { text: "Introduction", link: "/api/" },
  {
    text: "<code>Indiekit.addCollection</code>",
    link: "/api/add-collection",
  },
  {
    text: "<code>Indiekit.addEndpoint</code>",
    link: "/api/add-endpoint",
  },
  {
    text: "<code>Indiekit.addPostType</code>",
    link: "/api/add-post-type",
  },
  {
    text: "<code>Indiekit.addPreset</code>",
    link: "/api/add-preset",
  },
  {
    text: "<code>Indiekit.addStore</code>",
    link: "/api/add-store",
  },
  {
    text: "<code>Indiekit.addSyndicator</code>",
    link: "/api/add-syndicator",
  },
  {
    text: "<code>IndiekitError</code>",
    link: "/api/error",
  },
];

const sidebarPlugins = [
  {
    text: "Content stores",
    link: "/plugins/stores",
    items: [
      {
        text: "Bitbucket",
        link: "/plugins/stores/bitbucket",
      },
      {
        text: "File system",
        link: "/plugins/stores/file-system",
      },
      {
        text: "FTP",
        link: "/plugins/stores/ftp",
      },
      {
        text: "Gitea",
        link: "/plugins/stores/gitea",
      },
      {
        text: "GitHub",
        link: "/plugins/stores/github",
      },
      {
        text: "GitLab",
        link: "/plugins/stores/gitlab",
      },
      {
        text: "S3-compatible",
        link: "/plugins/stores/s3",
      },
    ],
  },
  {
    text: "Endpoints",
    link: "/plugins/endpoints",
    items: [
      {
        text: "IndieAuth",
        link: "/plugins/endpoints/auth",
      },
      {
        text: "Files",
        link: "/plugins/endpoints/files",
      },
      {
        text: "Image resizing",
        link: "/plugins/endpoints/image",
      },
      {
        text: "JSON Feed",
        link: "/plugins/endpoints/json-feed",
      },
      {
        text: "Micropub",
        link: "/plugins/endpoints/micropub",
      },
      {
        text: "Micropub media",
        link: "/plugins/endpoints/media",
      },
      {
        text: "Posts",
        link: "/plugins/endpoints/posts",
      },
      {
        text: "Share",
        link: "/plugins/endpoints/share",
      },
      {
        text: "Syndicate",
        link: "/plugins/endpoints/syndicate",
      },
      {
        text: "Webmention.io",
        link: "/plugins/endpoints/webmention-io",
      },
    ],
  },
  {
    text: "Post types",
    link: "/plugins/post-types",
    items: [
      {
        text: "Article",
        link: "/plugins/post-types/article",
      },
      {
        text: "Audio",
        link: "/plugins/post-types/audio",
      },
      {
        text: "Bookmark",
        link: "/plugins/post-types/bookmark",
      },
      {
        text: "Event",
        link: "/plugins/post-types/event",
      },
      {
        text: "Jam",
        link: "/plugins/post-types/jam",
      },
      {
        text: "Like",
        link: "/plugins/post-types/like",
      },
      {
        text: "Note",
        link: "/plugins/post-types/note",
      },
      {
        text: "Photo",
        link: "/plugins/post-types/photo",
      },
      {
        text: "Reply",
        link: "/plugins/post-types/reply",
      },
      {
        text: "Repost",
        link: "/plugins/post-types/repost",
      },
      {
        text: "RSVP",
        link: "/plugins/post-types/rsvp",
      },
      {
        text: "Video",
        link: "/plugins/post-types/video",
      },
    ],
  },
  {
    text: "Publication presets",
    link: "/plugins/presets",
    items: [
      {
        text: "Eleventy",
        link: "/plugins/presets/eleventy",
      },
      {
        text: "Hugo",
        link: "/plugins/presets/hugo",
      },
      {
        text: "Jekyll",
        link: "/plugins/presets/jekyll",
      },
    ],
  },
  {
    text: "Syndicators",
    link: "/plugins/syndicators",
    items: [
      {
        text: "Bluesky",
        link: "/plugins/syndicators/bluesky",
      },
      {
        text: "Internet Archive",
        link: "/plugins/syndicators/internet-archive",
      },
      {
        text: "Mastodon",
        link: "/plugins/syndicators/mastodon",
      },
    ],
  },
];

/**
 * @type {import("vitepress").UserConfig}
 */
export default {
  title: "Indiekit",
  description:
    "The little server that connects your website to the independent web.",
  head: [
    ["link", { rel: "icon", href: "/icon.svg" }],
    ["meta", { name: "supported-color-schemes", content: "light dark" }],
    ["meta", { name: "theme-color", content: "#60c" }],
    ["meta", { property: "og:image", content: "/opengraph-image.png" }],
  ],
  lang: "en-GB",
  cacheDir: ".cache",
  cleanUrls: "without-subfolders",
  markdown: {
    anchor: {
      level: [1, 2, 3],
      permalink: markdownAnchor.permalink.headerLink({
        class: "heading-anchor",
        safariReaderFix: true,
      }),
    },
    config: (md) => {
      md.use(markdownDefList);
      md.use(markdownFootnote);
      md.use(markdownTaskLists);
    },
    container: {
      tipLabel: "Tip",
      warningLabel: "Warning",
      infoLabel: "Information",
    },
    linkify: false,
  },
  outDir: "../_site",
  sitemap: {
    hostname: "https://getindiekit.com",
  },
  themeConfig: {
    algolia: {
      appId: "ASMV5WWEJ4",
      apiKey: "a7ee0109aafc4a9f22cae2bd4538652d",
      indexName: "getindiekit",
    },
    editLink: {
      pattern: "https://github.com/getindiekit/indiekit/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message:
        'Distributed under the <a href="https://github.com/getindiekit/indiekit/blob/main/LICENSE">MIT License</a>.',
      copyright: `© ${new Date().getFullYear()} <a href="https://mastodon.social/@paulrobertlloyd" rel="me">Paul Robert Lloyd</a>`,
    },
    logo: {
      dark: {
        src: "icon.svg#dark",
      },
      light: {
        src: "icon.svg",
      },
    },
    nav: [
      {
        text: "Documentation",
        link: "/get-started",
      },
      {
        text: "Plug-ins",
        link: "/plugins/",
        activeMatch: "/plugins/",
      },
      {
        text: "API",
        link: "/api",
      },
      {
        text: _package.version,
        link: "https://github.com/getindiekit/indiekit/releases",
      },
      {
        text: "🇺🇦",
        link: "https://www.withukraine.org",
      },
    ],
    sidebar: {
      "/": sidebar,
      "/api/": sidebarApi,
      "/plugins/": sidebarPlugins,
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/getindiekit/indiekit" },
    ],
  },
};
