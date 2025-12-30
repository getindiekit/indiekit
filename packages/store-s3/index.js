import path from "node:path";
import process from "node:process";

import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { IndiekitError } from "@indiekit/error";

const defaults = {
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  region: "",
  endpoint: "",
  bucket: "",
};

export default class S3Store {
  name = "S3 store";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.accessKey] - Access key
   * @param {string} [options.secretKey] - Secret key
   * @param {string} [options.region] - Region name
   * @param {string} [options.endpoint] - Endpoint URL
   * @param {string} [options.bucket] - Bucket name
   * @param {string} [options.acl] - Access Control List (ACL) policy
   */
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  get environment() {
    return ["S3_ACCESS_KEY", "S3_SECRET_KEY"];
  }

  get info() {
    const { endpoint, bucket } = this.options;

    return {
      name: `${bucket} bucket`,
      uid: `${endpoint}/${bucket}`,
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "region",
        message: "In which region is your S3-compatible storage located?",
        description: "i.e. us-west",
      },
      {
        type: "text",
        name: "endpoint",
        message: "What is your S3-compatible endpoint?",
        validate: (value) =>
          URL.canParse(value)
            ? true
            : "Enter a valid URL, for example https://s3-example-us-west-1.amazonaws.com",
      },
      {
        type: "text",
        name: "bucket",
        message: "Which bucket do you want to save files in?",
      },
    ];
  }

  /**
   * Get S3 client interface
   * @returns {S3Client} S3 client interface
   */
  client() {
    const client = new S3Client({
      credentials: {
        accessKeyId: this.options.accessKey,
        secretAccessKey: this.options.secretKey,
      },
      endpoint: this.options.endpoint,
      region: this.options.region,
    });

    return client;
  }

  /**
   * Check if file exists
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>} File exists
   */
  async fileExists(filePath) {
    try {
      const getCommand = new GetObjectCommand({
        Bucket: this.options.bucket,
        Key: filePath,
      });

      await this.client().send(getCommand);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Promise<string>} File created
   */
  async createFile(filePath, content) {
    const params = {
    Bucket: this.options.bucket,
    Key: filePath,
    Body: content,
    };

    if (this.options.acl) {
      params.ACL = this.options.acl;
    }

    const putCommand = new PutObjectCommand(params);

    try {
      const fileExists = await this.fileExists(filePath);
      if (fileExists) {
        return;
      }

      const { ETag } = await this.client().send(putCommand);

      if (ETag) {
        const url = new URL(this.info.uid);
        url.pathname = path.join(url.pathname, filePath);

        return url.href;
      }
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   */
  async readFile(filePath) {
    const getCommand = new GetObjectCommand({
      Bucket: this.options.bucket,
      Key: filePath,
    });

    try {
      const { Body } = await this.client().send(getCommand);

      if (Body) {
        const content = await Body.transformToString();

        return content;
      }
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
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} [options] - Options
   * @param {string} [options.newPath] - New path to file
   * @returns {Promise<string>} Updated file URL
   */
  async updateFile(filePath, content, options) {
    const params = {
      Bucket: this.options.bucket,
      Key: filePath,
      Body: content,
    };
    if (this.options.acl) {
      params.ACL = this.options.acl;
    }
    const putCommand = new PutObjectCommand(params);

    try {
      const { ETag } = await this.client().send(putCommand);

      if (ETag && options?.newPath) {
        const copyCommand = new CopyObjectCommand({
          Bucket: this.options.bucket,
          CopySource: path.join(this.options.bucket, filePath),
          Key: options.newPath,
        });

        const deleteCommand = new DeleteObjectCommand({
          Bucket: this.options.bucket,
          Key: filePath,
        });

        await this.client().send(copyCommand);
        await this.client().send(deleteCommand);
      }

      if (ETag) {
        const updatedFilePath = options?.newPath || filePath;
        const url = new URL(this.info.uid);
        url.pathname = path.join(url.pathname, updatedFilePath);

        return url.href;
      }
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
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>} File deleted
   */
  async deleteFile(filePath) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.options.bucket,
      Key: filePath,
    });

    try {
      const thing = await this.client().send(deleteCommand);

      return thing.DeleteMarker;
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
}
