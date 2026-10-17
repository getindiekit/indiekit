import "i18n";
import "prompts";

import { Collection } from "mongodb";

declare global {
  /** The Indiekit instance passed to each plug-in’s `init()` */
  type IndiekitInstance = InstanceType<
    typeof import("../../packages/indiekit/index.js").Indiekit
  >;

  /** Configuration, as written in `indiekit.config.js` or `package.json` */
  interface IndiekitConfig {
    application?: Partial<IndiekitApplication>;
    /** Package names of plug-ins to install */
    plugins?: string[];
    publication?: Partial<
      Pick<
        IndiekitPublication,
        | "categories"
        | "channels"
        | "enrichPostData"
        | "locale"
        | "me"
        | "slugSeparator"
      >
    > & {
      postTypes?: Record<string, Partial<IndiekitPostType>>;
    };
    /** Options for each plug-in, keyed by its package name */
    [pluginName: string]: unknown;
  }

  /** A resolved content store plug-in */
  interface IndiekitStore {
    info: { name: string; uid: string };
    environment?: string[];
    /** Questions asked when setting up the plug-in with `create-indiekit` */
    prompts?: PromptObject[];
    /** Register the plug-in with Indiekit */
    init(Indiekit: IndiekitInstance): void | Promise<void>;
  }

  /** An item in the main navigation, added by an endpoint plug-in */
  interface IndiekitNavigationItem {
    href: string;
    text: string;
    requiresDatabase?: boolean;
  }

  /** A shortcut on the home page, added by an endpoint plug-in */
  interface IndiekitShortcutItem {
    url: string;
    name: string;
    iconName: string;
    requiresDatabase?: boolean;
  }

  /** An endpoint plug-in */
  interface IndiekitEndpoint extends IndiekitPlugin {
    mountPath?: string;
    /** Routes that require authentication */
    routes?: import("express").Router;
    /** Routes that don’t require authentication */
    routesPublic?: import("express").Router;
    /** Routes mounted at `/.well-known` */
    routesWellKnown?: import("express").Router;
    navigationItems?: IndiekitNavigationItem | IndiekitNavigationItem[];
    shortcutItems?: IndiekitShortcutItem | IndiekitShortcutItem[];
    validationSchemas?: import("express-validator").Schema;
  }

  /** A post type plug-in */
  interface IndiekitPostTypePlugin extends IndiekitPlugin {
    /** Post type configuration, merged into any existing configuration */
    config: Partial<IndiekitPostType>;
    validationSchemas?: import("express-validator").Schema;
  }

  /** A publication preset plug-in */
  interface IndiekitPreset extends IndiekitPlugin {
    info: { name: string };
    postTypes?: Record<string, IndiekitPostType>;
    postTemplate?(properties: Record<string, any>): string;
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
      content: string,
      options: { message: string },
    ): Promise<string | false>;
    updateFile(
      path: string,
      content: string,
      options: { message: string; newPath?: string },
    ): Promise<string | false>;
    deleteFile(path: string, options: { message: string }): Promise<boolean>;
  }

  /** A resolved publication preset plug-in */
  interface IndiekitPreset {
    name: string;
    postTypes?: Record<string, IndiekitPostType>;
    postTemplate?(properties: Record<string, any>): string;
  }

  /** Information a syndication target shows about itself */
  interface IndiekitSyndicationTargetInfo {
    checked?: boolean;
    error?: string;
    name?: string;
    uid?: string;
    service: { name: string; photo: string; url?: string };
    user?: { name: string; url: string };
  }

  /** A resolved syndication target plug-in */
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
    h?: string;
    discovery?: string;
    post?: { path?: string; url?: string };
    media?: { path?: string; url?: string };
    fields?: Record<string, any>;
    "required-properties"?: string[];
  }

  interface IndiekitApplication {
    authorizationEndpoint: string;
    introspectionEndpoint: string;
    locale: string;
    mediaEndpoint: string;
    micropubEndpoint: string;
    mongodbUrl: string | false;
    name: string;
    port: string | number;
    shareEndpoint: string;
    themeColor: string;
    themeColorScheme: "automatic" | "light" | "dark";
    timeZone: string;
    tokenEndpoint: string;
    ttl: number;
    url: string;
    userinfoEndpoint: string;

    // Added per request by `lib/middleware/locals.js`
    collections: Map<string, any>;
    localeUsed: string;
    package: Record<string, any>;
    shortcuts: Array<Record<string, any>>;

    // Only set when serving HTML
    cssPath?: string;
    jsPath?: string;
    navigation?: Array<Record<string, any>>;
  }

  interface IndiekitPublication {
    categories: string[];
    channels: Record<string, { name: string; url?: string }>;
    enrichPostData?: boolean;
    locale: string;
    me: string;
    mediaStore: IndiekitStore;
    postTemplate(properties: Record<string, any>): string;
    postTypes: Record<string, IndiekitPostType>;
    preset?: IndiekitPreset;
    slugSeparator: string;
    store: IndiekitStore;
    storeMessageTemplate(metadata: {
      action: string;
      fileType: string;
      postType: string;
    }): string;
    syndicationTargets: IndiekitSyndicationTarget[];
  }

  namespace Express {
    interface Locals extends i18nAPI {
      application: IndiekitApplication;
      publication: IndiekitPublication;
    }
  }
}
