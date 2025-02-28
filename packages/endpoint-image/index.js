import { IndiekitEndpointPlugin } from "@indiekit/plugin";
import {
  createIPX,
  ipxFSStorage,
  ipxHttpStorage,
  createIPXNodeServer,
} from "ipx";

const defaults = {
  mountPath: "/image",
};

export default class ImageEndpointPlugin extends IndiekitEndpointPlugin {
  name = "Image resizing endpoint";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.mountPath] - Path to endpoint
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.mountPath = this.options.mountPath;
  }

  routes() {
    const ipx = createIPX({
      storage: ipxFSStorage({ dir: "./public" }),
      httpStorage: ipxHttpStorage({
        domains: this.indiekit.config.publication.me,
      }),
    });

    this.router.use(createIPXNodeServer(ipx));

    return this.router;
  }

  async init() {
    await super.init();

    this.indiekit.config.application.imageEndpoint = this.mountPath;
  }
}
