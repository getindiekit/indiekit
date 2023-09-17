import path from "node:path";
import process from "node:process";
import { Readable } from "node:stream";
import { IndiekitError } from "@indiekit/error";
import Client from "ssh2-sftp-client";

const defaults = {
  directory: "",
  password: process.env.FTP_PASSWORD,
  port: 22,
  user: process.env.FTP_USER,
};

export default class FtpStore {
  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.host] - FTP hostname
   * @param {string} [options.user] - FTP username
   * @param {string} [options.password] - FTP password
   * @param {string} [options.directory] - Directory
   */
  constructor(options = {}) {
    this.id = "ftp";
    this.meta = import.meta;
    this.name = "FTP store";
    this.options = { ...defaults, ...options };
  }

  get environment() {
    return ["FTP_PASSWORD", "FTP_USER"];
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

  /**
   * Get FTP client interface
   * @access private
   * @returns {Promise<Client>} FTP client interface
   */
  async #client() {
    const { host, user: username, password, port } = this.options;
    const client = new Client();

    try {
      await client.connect({ host, username, password, port });
      return client;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Create readable stream
   * @access private
   * @param {string} content - File content
   * @returns {Readable} Readable stream
   */
  #createReadableStream(content) {
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(content, "utf8");
    // eslint-disable-next-line unicorn/no-array-push-push, unicorn/no-null
    readableStream.push(null);
    return readableStream;
  }

  /**
   * Get absolute file path
   * @access private
   * @param {string} filePath - Path to file
   * @returns {string} Absolute file path
   */
  #absolutePath(filePath) {
    return path.join(this.options.directory, filePath);
  }

  /**
   * Create file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Promise<string>} File created
   */
  async createFile(filePath, content) {
    const client = await this.#client();

    try {
      const readableStream = this.#createReadableStream(content);
      const absolutePath = this.#absolutePath(filePath);

      // Create directory if doesn’t exist
      const directory = path.dirname(absolutePath);
      const directoryType = await client.exists(directory);
      if (directoryType !== "d") {
        await client.mkdir(directory, true);
      }

      await client.put(readableStream, absolutePath);

      const url = new URL(this.info.uid);
      url.pathname = path.join(url.pathname, filePath);

      return url.href;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    } finally {
      await client.end();
    }
  }

  /**
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   */
  async readFile(filePath) {
    const client = await this.#client();

    try {
      const absolutePath = this.#absolutePath(filePath);

      return await client.get(absolutePath, undefined, {
        readStreamOptions: { encoding: "utf8" },
      });
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    } finally {
      await client.end();
    }
  }

  /**
   * Update file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.newPath - New path to file
   * @returns {Promise<string>} File updated
   */
  async updateFile(filePath, content, options) {
    const client = await this.#client();

    try {
      const readableStream = this.#createReadableStream(content);
      const absolutePath = this.#absolutePath(filePath);

      await client.put(readableStream, absolutePath);

      if (options?.newPath) {
        await client.rename(absolutePath, this.#absolutePath(options.newPath));
      }

      const url = new URL(this.info.uid);
      url.pathname = path.join(url.pathname, options?.newPath || filePath);

      return url.href;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    } finally {
      await client.end();
    }
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File deleted
   */
  async deleteFile(filePath) {
    const client = await this.#client();

    try {
      const absolutePath = this.#absolutePath(filePath);

      return await client.delete(absolutePath);
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    } finally {
      await client.end();
    }
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
}
