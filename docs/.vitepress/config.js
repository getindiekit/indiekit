import { version } from "../../packages/indiekit/package.json" assert { type: "json" };

const sidebar = [
  {
    text: "Introduction",
    items: [
      { text: "How Indiekit works", link: "/introduction" },
      { text: "Core concepts", link: "/concepts" },
      { text: "Get started", link: "/get-started" },
      { text: "Contributing", link: "/contributing" },
    ],
  },
  {
    text: "Configuration",
    items: [
      { text: "Options", link: "/configuration/" },
      { text: "Post types", link: "/configuration/post-types" },
      { text: "Post template", link: "/configuration/post-template" },
      { text: "Commit messages", link: "/configuration/commit-messages" },
      { text: "Localisation", link: "/configuration/localisation" },
      { text: "Time zone", link: "/configuration/time-zone" },
    ],
  },
];

const sidebarPlugins = [
  {
    text: "Plug-ins",
    items: [
      { text: "Content stores", link: "/plugins/stores" },
      { text: "Endpoints", link: "/plugins/endpoints" },
      { text: "Publication presets", link: "/plugins/presets" },
      { text: "Syndicators", link: "/plugins/syndicators" },
    ],
  },
  {
    text: "Plug-in API",
    items: [
      { text: "Introduction", link: "/plugins/api/" },
      {
        text: "<code>Indiekit.addEndpoint</code>",
        link: "/plugins/api/add-endpoint",
      },
      {
        text: "<code>Indiekit.addPreset</code>",
        link: "/plugins/api/add-preset",
      },
      {
        text: "<code>Indiekit.addStore</code>",
        link: "/plugins/api/add-store",
      },
      {
        text: "<code>Indiekit.addSyndicator</code>",
        link: "/plugins/api/add-syndicator",
      },
      {
        text: "<code>IndiekitError</code>",
        link: "/plugins/api/error",
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
    ["link", { rel: "icon", href: "icon.svg" }],
    ["meta", { name: "supported-color-schemes", content: "light dark" }],
    ["meta", { name: "theme-color", content: "#60c" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: "opengraph_image.png" }],
    ["meta", { property: "og:image", content: "opengraph_image.png" }],
  ],
  lang: "en-GB",
  cleanUrls: "without-subfolders",
  markdown: {
    linkify: false,
  },
  themeConfig: {
    editLink: {
      pattern: "https://github.com/getindiekit/indiekit/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message:
        'Distributed under the <a href="https://github.com/getindiekit/indiekit/blob/main/LICENSE">MIT License</a>.',
      copyright: `© ${new Date().getFullYear()} Paul Robert Lloyd`,
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
        link: "/introduction",
      },
      {
        text: "Plug-ins",
        link: "/plugins/",
        activeMatch: "/plugins/",
      },
      {
        text: version,
        link: "https://github.com/getindiekit/indiekit/releases",
      },
      {
        text: "🇺🇦",
        link: "https://www.withukraine.org",
      },
    ],
    sidebar: {
      "/": sidebar,
      "/plugins/": sidebarPlugins,
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/getindiekit/indiekit" },
    ],
  },
};
