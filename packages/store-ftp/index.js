import path from "node:path";
import process from "node:process";
import { Readable } from "node:stream";
import { IndiekitError } from "@indiekit/error";
import ftp from "basic-ftp";

const defaults = {
  directory: "",
  password: process.env.FTP_PASSWORD,
  port: 21,
  user: process.env.FTP_USER,
  verbose: true,
};

/**
 * @typedef Response
 * @property {object} response FTP response
 */
export const FtpStore = class {
  constructor(options = {}) {
    this.id = "ftp";
    this.meta = import.meta;
    this.name = "FTP store";
    this.options = { ...defaults, ...options };
  }

  get info() {
    const { directory, host, user } = this.options;

    return {
      name: `${user} on ${host}`,
      uid: `sftp://${host}/${directory}`,
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "host",
        message: "Where is your FTP server hosted?",
        description: "i.e. ftp.server.example",
      },
      {
        type: "text",
        name: "user",
        message: "What is your FTP username?",
      },
      {
        type: "text",
        name: "directory",
        message: "Which directory do you want to save files in?",
      },
    ];
  }

  async client() {
    const { host, user, password, port, verbose } = this.options;
    const client = new ftp.Client();
    client.ftp.verbose = verbose;
    await client.access({ host, user, password, port, secure: true });
    return client;
  }

  /**
   * Create readable stream
   *
   * @private
   * @param {string} content - File content
   * @returns {string} Readable stream
   */
  #createReadableStream(content) {
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(content, "utf8");
    readableStream.push(null); // eslint-disable-line unicorn/no-array-push-push
    return readableStream;
  }

  /**
   * Get absolute file path
   *
   * @private
   * @param {string} filePath - Path to file
   * @returns {string} Absolute file path
   */
  #getAbsolutePath(filePath) {
    return path.join(this.options.directory, filePath);
  }

  /**
   * Create file
   *
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Promise<Response>} A promise to the response
   */
  async createFile(filePath, content) {
    try {
      const client = await this.client();
      const readableStream = this.#createReadableStream(content);
      const absolutePath = this.#getAbsolutePath(filePath);
      const dirname = path.dirname(absolutePath);
      const basename = path.basename(absolutePath);

      await client.ensureDir(dirname);
      await client.uploadFrom(readableStream, basename);

      client.close();
      return true;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Update file
   *
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Promise<Response>} A promise to the response
   */
  async updateFile(filePath, content) {
    try {
      const client = await this.client();
      const readableStream = this.#createReadableStream(content);
      const absolutePath = this.#getAbsolutePath(filePath);

      await client.uploadFrom(readableStream, absolutePath);

      client.close();
      return true;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Delete file
   *
   * @param {string} filePath - Path to file
   * @returns {Promise<Response>} A promise to the response
   */
  async deleteFile(filePath) {
    try {
      const absolutePath = this.#getAbsolutePath(filePath);
      const client = await this.client();

      await client.remove(absolutePath);

      client.close();
      return true;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
};

export default FtpStore;
