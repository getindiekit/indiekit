import { Buffer } from "node:buffer";
import { fetch } from "undici";

export const Adapter = class {
  constructor(options = {}) {
    this.prefixUrl = options.prefixUrl;
  }

  async fetch(id) {
    try {
      const url = new URL(id, this.prefixUrl).href;
      const response = await fetch(url);

      if (!response.ok) {
        return undefined;
      }

      // Blob returned by fetch() but express-sharp expects a Buffer
      const body = await response.blob();
      const arrayBuffer = await body.arrayBuffer();
      const buffer = await Buffer.from(arrayBuffer, "binary");

      return buffer;
    } catch {
      return undefined;
    }
  }
};
