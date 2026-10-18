declare module "base-create" {
  /** A file to create, following the `vinyl` file schema */
  interface CreateFile {
    path: string;
    contents?: string | object;
  }

  interface CreateOptions {
    /** Package name, defaults to the directory given on the command line */
    name?: string;
    scope?: string;
    /** Packages to install with `npm add` */
    dependencies?: string[];
    /** Packages to install with `npm add -D` */
    devDependencies?: string[];
    files?: Array<string | CreateFile>;
    /** Values to add to `package.json` */
    package?: Record<string, unknown>;
    /** Commands to run once the package has been created */
    commands?: string[];
    skipGitignore?: boolean;
    skipInstall?: boolean;
    skipReadme?: boolean;
  }

  export default function create(options: CreateOptions): {
    name: string;
    packageDir: string;
  };
}
