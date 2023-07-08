import { Buffer } from "node:buffer";

export const Adapter = class {
  constructor(options = {}) {
    this.prefixUrl = options.prefixUrl;
  }

  async fetch(id) {
    try {
      const url = new URL(id, this.prefixUrl).href;
      const response = await fetch(url);

      if (!response.ok) {
        return;
      }

      // Blob returned by fetch() but express-sharp expects a Buffer
      const body = await response.blob();
      const arrayBuffer = await body.arrayBuffer();
      const buffer = await Buffer.from(arrayBuffer);

      return buffer;
    } catch {
      return;
    }
  }
};
