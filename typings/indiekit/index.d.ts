import "i18n";

import { Collection } from "mongodb";

declare global {
  /** A resolved content store plug-in */
  interface IndiekitStore {
    info: { name: string; uid: string };
    environment?: string[];
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

  /** A resolved syndication target plug-in */
  interface IndiekitSyndicationTarget {
    info: {
      checked?: boolean;
      error?: string;
      name?: string;
      uid?: string;
      service: { name: string; photo: string; url?: string };
      user?: { name: string; url: string };
    };
  }

  /** Path and URL templates for a post type */
  interface IndiekitPostType {
    type: string;
    name: string;
    post?: { path?: string; url?: string };
    media?: { path?: string; url?: string };
    fields?: Record<string, any>;
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
