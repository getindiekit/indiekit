import "i18n";
import "prompts";

declare global {
  /**
   * MongoDB collection, as created by `@indiekit/util`
   *
   * Taken from `@indiekit/util` rather than imported from `mongodb`, so it
   * resolves to the same copy of the driver that creates collections at runtime
   */
  type Collection = import("@indiekit/util").Collection;

  /** The Indiekit instance passed to each plug-in’s `init()` */
  type IndiekitInstance =
    (typeof import("../../packages/indiekit/index.js").Indiekit)["prototype"];

  /**
   * Configuration, as written in `indiekit.config.js` or `package.json`
   * @see {@link https://getindiekit.com/configuration/}
   */
  interface IndiekitConfig {
    application?: Partial<IndiekitApplicationConfig>;
    /** Package names of plug-ins to install */
    plugins?: string[];
    publication?: IndiekitPublicationConfig;
    /** Options for each plug-in, keyed by its package name */
    [pluginName: string]: unknown;
  }

  /** Configuration, once Indiekit has merged it with its defaults */
  interface IndiekitResolvedConfig extends IndiekitConfig {
    /**
     * Also holds the values that `lib/middleware/locals.js` adds for each
     * request, so that they persist on `app.locals`, which every request shares
     */
    application: Partial<IndiekitApplicationConfig & IndiekitApplicationLocals>;
    plugins: string[];
    publication: IndiekitPublicationConfig;
  }

  /**
   * Application configuration
   * @see {@link https://getindiekit.com/configuration/application}
   */
  interface IndiekitApplicationConfig {
    /** Name of the application, as shown in its interface */
    name: string;
    /** Locale of the application interface */
    locale: string;
    /** MongoDB connection string, or `false` if there is no database */
    mongodbUrl: string | false;
    /** Port the server listens on */
    port: string | number;
    /** Accent colour of the application interface */
    themeColor: string;
    /** Colour scheme of the application interface */
    themeColorScheme: "automatic" | "light" | "dark";
    /** Time zone used for dates, or `client` to use the date a client sends */
    timeZone: string;
    /** Time to keep cached responses, in seconds */
    ttl: number;
    /** URL the application is served from */
    url: string;

    /**
     * Endpoint URLs, set by the plug-in providing each endpoint unless
     * configured, so that an external endpoint can be used instead
     */
    authorizationEndpoint: string;
    introspectionEndpoint: string;
    mediaEndpoint: string;
    micropubEndpoint: string;
    shareEndpoint: string;
    tokenEndpoint: string;
    userinfoEndpoint: string;

    /** Endpoint URLs, only set if the plug-in providing them is installed */
    filesEndpoint?: string;
    imageEndpoint?: string;
    jsonFeed?: string;
    microsubEndpoint?: string;
    postsEndpoint?: string;
    /** Path `endpoint-posts` posts syndication requests to, set by `endpoint-syndicate` */
    _syndicationEndpointPath?: string;
  }

  /** Values `lib/middleware/locals.js` adds to the application for each request */
  interface IndiekitApplicationLocals {
    /** Database collections, keyed by name */
    collections: Map<string, Collection>;
    /** Locale used for the current request */
    localeUsed: string;
    /** Details of the installed `@indiekit/indiekit` package */
    package: { version: string; repository?: { url: string } };
    /** Shortcuts shown on the home page */
    shortcuts: Array<
      Pick<IndiekitShortcutItem, "name" | "url"> & {
        icons?: Array<{ src: string; sizes: string }>;
      }
    >;

    /** Path to the application stylesheet, only set when serving HTML */
    cssPath?: string;
    /** Path to the application script, only set when serving HTML */
    jsPath?: string;
    /** Navigation items, only set when serving HTML */
    navigation?: Array<
      IndiekitNavigationItem & { attributes?: Record<string, string> }
    >;
  }

  /** Application configuration, with values added for each request */
  interface IndiekitApplication
    extends IndiekitApplicationConfig, IndiekitApplicationLocals {}

  /**
   * Publication configuration, before Indiekit resolves it
   * @see {@link https://getindiekit.com/configuration/publication}
   */
  interface IndiekitPublicationConfig {
    /** Categories, or URL of a JSON file listing them */
    categories?: string[] | string;
    /** Channels posts can be published to, keyed by UID */
    channels?: Record<string, { name: string; url?: string }>;
    /** Fetch data about URLs referenced in posts, such as a reply’s target */
    enrichPostData?: boolean;
    /** Locale of the publication */
    locale?: string;
    /** URL of the publication */
    me?: string;
    /** Package name of a content store plug-in for media, or the store */
    mediaStore?: string | IndiekitStore;
    /** Render post properties in the file format the publication uses */
    postTemplate?: IndiekitPublication["postTemplate"];
    /** Post type configuration, merged with defaults by Indiekit */
    postTypes?: Record<string, Partial<IndiekitPostType>>;
    /** Separator used between words in slugs */
    slugSeparator?: string;
    /** Package name of a content store plug-in, or the store */
    store?: string | IndiekitStore;
    /** Message used when saving files to a content store, such as a commit message */
    storeMessageTemplate?: IndiekitPublication["storeMessageTemplate"];
  }

  /** Details of a change to a content store, used to write its message */
  interface IndiekitStoreMessageMetadata {
    /** Action taken, i.e. `create`, `update` or `delete` */
    action: string;
    /** Type of file changed, i.e. `post` or `file` */
    fileType: string;
    /** Type of post changed, i.e. `note` */
    postType: string;
  }

  /** Publication configuration, once Indiekit has resolved it */
  interface IndiekitPublication {
    /** Categories, resolved from configuration by `lib/categories.js` */
    categories: string[];
    /** Channels posts can be published to, keyed by UID */
    channels: Record<string, { name: string; url?: string }>;
    /** Fetch data about URLs referenced in posts, such as a reply’s target */
    enrichPostData?: boolean;
    /** Locale of the publication */
    locale: string;
    /** URL of the publication */
    me: string;
    /** Content store media files are saved to */
    mediaStore: IndiekitStore;
    /** Render post properties in the file format the publication uses */
    postTemplate(properties: Jf2Properties): string;
    /** Post types, keyed by type */
    postTypes: Record<string, IndiekitPostType>;
    /** Publication preset, if one is installed */
    preset?: IndiekitPreset;
    /** Separator used between words in slugs */
    slugSeparator: string;
    /** Content store posts are saved to */
    store: IndiekitStore;
    /** Message used when saving files to a content store, such as a commit message */
    storeMessageTemplate(metadata: IndiekitStoreMessageMetadata): string;
    /** Syndication targets posts can be shared to */
    syndicationTargets: IndiekitSyndicationTarget[];
  }

  /** An item in the main navigation, added by an endpoint plug-in */
  interface IndiekitNavigationItem {
    /** Path the item links to */
    href: string;
    /** Text of the item, or the key of a localised string */
    text: string;
    /** Only show the item if a database is configured */
    requiresDatabase?: boolean;
    /** Show the item with less prominence */
    secondary?: boolean;
  }

  /** A shortcut on the home page, added by an endpoint plug-in */
  interface IndiekitShortcutItem {
    /** Path the shortcut links to */
    url: string;
    /** Name of the shortcut, or the key of a localised string */
    name: string;
    /** Name of the icon shown with the shortcut */
    iconName?: string;
    /** Only show the shortcut if a database is configured */
    requiresDatabase?: boolean;
  }

  /** A plug-in */
  interface IndiekitPlugin {
    /** Human-readable name of the plug-in */
    name: string;
    /** Environment variables used by the plug-in */
    environment?: string[];
    /** Questions asked when setting up the plug-in with `create-indiekit` */
    prompts?: PromptObject[];
    /** Register the plug-in with Indiekit */
    init(Indiekit: IndiekitInstance): void | Promise<void>;
    /** Directory the plug-in is installed in, set by Indiekit */
    filePath?: string;
    /** Normalised package name, set by Indiekit */
    id?: string;
  }

  /** An endpoint plug-in */
  interface IndiekitEndpoint extends IndiekitPlugin {
    /** Path the endpoint’s routes are mounted at */
    mountPath?: string;
    /** Routes that require authentication */
    routes?: import("express").Router;
    /** Routes that don’t require authentication */
    routesPublic?: import("express").Router;
    /** Routes mounted at `/.well-known` */
    routesWellKnown?: import("express").Router;
    /** Routes that need the Indiekit instance, mounted without authentication */
    _routes?(Indiekit: IndiekitInstance): import("express").Router;
    navigationItems?: IndiekitNavigationItem | IndiekitNavigationItem[];
    shortcutItems?: IndiekitShortcutItem | IndiekitShortcutItem[];
    validationSchemas?: import("express-validator").Schema;
  }

  /** A post type plug-in */
  interface IndiekitPostTypePlugin extends IndiekitPlugin {
    /**
     * Post type configuration, merged into any existing configuration. A
     * plug-in can leave it out to only add validation schemas.
     */
    config?: Partial<IndiekitPostType>;
    validationSchemas?: import("express-validator").Schema;
  }

  /** A publication preset plug-in */
  interface IndiekitPreset extends IndiekitPlugin {
    info: { name: string };
    /** Post type configuration, merged with defaults by Indiekit */
    postTypes?: Record<string, Partial<IndiekitPostType>>;
    /** Render post properties in the file format the preset uses */
    postTemplate?(properties: Jf2Properties): string;
  }

  /** Information a content store shows about itself */
  interface IndiekitStoreInfo {
    name?: string;
    uid: string;
  }

  /** A content store plug-in */
  interface IndiekitStore extends IndiekitPlugin {
    info: IndiekitStoreInfo;
    fileExists?(path: string): Promise<boolean>;
    readFile?(path: string): Promise<string>;
    createFile(
      path: string,
      content: string | Uint8Array,
      options: { message: string },
    ): Promise<string | false>;
    updateFile(
      path: string,
      content: string | Uint8Array,
      options: { message: string; newPath?: string },
    ): Promise<string | false>;
    deleteFile(path: string, options: { message: string }): Promise<boolean>;
  }

  /** Information a syndication target shows about itself */
  interface IndiekitSyndicationTargetInfo {
    /** Select the target by default */
    checked?: boolean;
    /** Why the target can’t be used, if it is misconfigured */
    error?: string;
    name?: string;
    /** URL identifying the target, used as the `mp-syndicate-to` value */
    uid?: string;
    service: { name: string; photo: string; url?: string };
    user?: { name: string; url: string };
  }

  /** A syndication target plug-in */
  interface IndiekitSyndicationTarget extends IndiekitPlugin {
    info: IndiekitSyndicationTargetInfo;
    syndicate(
      properties: Jf2Properties,
      publication: IndiekitPublication,
    ): Promise<string | undefined>;
  }

  /** Path and URL templates for a post type */
  interface IndiekitPostType {
    type: string;
    name: string;
    /** Microformats vocabulary, i.e. `entry` or `event` */
    h?: string;
    discovery?: string;
    post?: { path?: string; url?: string };
    media?: { path?: string; url?: string };
    /** Fields shown when creating a post, keyed by property name */
    fields?: Record<string, { required?: boolean }>;
    /** Properties supported by this post type, listed by `q=post-types` */
    properties?: string[];
    "required-properties"?: string[];
  }

  namespace Express {
    interface Locals extends i18nAPI {
      application: IndiekitApplication;
      publication: IndiekitPublication;
    }
  }
}
