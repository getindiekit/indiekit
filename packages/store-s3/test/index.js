import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Indiekit } from "@indiekit/indiekit";
import { mockClient } from "aws-sdk-client-mock";

import S3Store from "../index.js";

describe("store-s3", () => {
  const s3 = new S3Store({
    region: "us-west",
    endpoint: "https://s3.example",
    bucket: "website",
  });

  const mockS3Client = mockClient(new S3Client());

  // @ts-ignore
  mock.method(s3, "client", () => mockS3Client);

  it("Gets plug-in info", () => {
    assert.equal(s3.name, "S3 store");
    assert.equal(s3.info.name, "website bucket");
    assert.equal(s3.info.uid, "https://s3.example/website");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(
      s3.prompts[0].message,
      "In which region is your S3-compatible storage located?",
    );
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({
      config: {
        plugins: ["@indiekit/store-s3"],
        publication: { me: "https://website.example" },
        "@indiekit/store-s3": { bucket: "website" },
      },
    });
    await indiekit.installPlugins();
    await indiekit.updatePublicationConfig();

    assert.equal(indiekit.publication.store.info.name, "website bucket");
  });

  it("Checks if file exists", async () => {
    mockS3Client.on(GetObjectCommand).resolves({ ETag: "true" });
    assert.equal(await s3.fileExists("foo.md"), true);

    mockS3Client.on(GetObjectCommand).rejects("Couldn’t get object");
    assert.equal(await s3.fileExists("foo.md"), false);
  });

  it("Creates file", async () => {
    mockS3Client.on(GetObjectCommand).rejects("Couldn’t get object");
    mockS3Client.on(PutObjectCommand).resolves({ ETag: "true" });

    assert.equal(
      await s3.createFile("foo.md", "foobar"),
      "https://s3.example/website/foo.md",
    );
  });

  it("Doesn’t create file if already exists", async () => {
    mockS3Client.on(GetObjectCommand).resolves({ ETag: "true" });

    assert.equal(await s3.createFile("foo.md", "foobar"), undefined);
  });

  it("Throws error creating file", async () => {
    mockS3Client.on(GetObjectCommand).rejects("Couldn’t get object");
    mockS3Client.on(PutObjectCommand).rejects("Couldn’t put object");

    await assert.rejects(s3.createFile("foo.md", ""), {
      message: "S3 store: Couldn’t put object",
    });
  });

  it("Reads file", async () => {
    mockS3Client.on(GetObjectCommand).resolves({
      // @ts-ignore
      Body: { transformToString: () => Promise.resolve("foobar") },
    });

    assert.equal(await s3.readFile("foo.md"), "foobar");
  });

  it("Throws error reading file", async () => {
    mockS3Client.on(GetObjectCommand).rejects("Couldn’t get object");

    await assert.rejects(s3.readFile("foo.md"), {
      message: "S3 store: Couldn’t get object",
    });
  });

  it("Updates file", async () => {
    mockS3Client.on(PutObjectCommand).resolves({ ETag: "true" });

    assert.equal(
      await s3.updateFile("foo.md", "foobar"),
      "https://s3.example/website/foo.md",
    );
  });

  it("Throws error updating file", async () => {
    mockS3Client.on(PutObjectCommand).rejects("Couldn’t put object");

    await assert.rejects(s3.updateFile("foo.md", ""), {
      message: "S3 store: Couldn’t put object",
    });
  });

  it("Updates and renames file", async () => {
    mockS3Client.on(PutObjectCommand).resolves({ ETag: "true" });

    assert.equal(
      await s3.updateFile("foo.md", "foobar", { newPath: "qux.md" }),
      "https://s3.example/website/qux.md",
    );
  });

  it("Throws error updates and renames file", async () => {
    mockS3Client.on(CopyObjectCommand).rejects("Couldn’t copy object");

    await assert.rejects(
      s3.updateFile("foo.md", "foobar", { newPath: "qux.md" }),
      {
        message: "S3 store: Couldn’t copy object",
      },
    );
  });

  it("Deletes file", async () => {
    mockS3Client.on(DeleteObjectCommand).resolves({ DeleteMarker: true });

    assert.equal(await s3.deleteFile("foo.md"), true);
  });

  it("Throws error deleting file", async () => {
    mockS3Client.on(DeleteObjectCommand).rejects("Couldn’t delete object");

    await assert.rejects(s3.deleteFile("foo.md"), {
      message: "S3 store: Couldn’t delete object",
    });
  });

  it("Throws error creating file if no access key", async () => {
    const s3NoKeys = new S3Store({ accessKey: "", secretKey: "" });

    await assert.rejects(s3NoKeys.createFile("foo.md", "foobar"), {
      message:
        "S3 store: No access key. Set the `accessKey` option or `S3_ACCESS_KEY`.",
      status: 401,
    });
  });

  it("Throws error creating file if no secret key", async () => {
    const s3NoSecret = new S3Store({ accessKey: "abcd1234", secretKey: "" });

    await assert.rejects(s3NoSecret.createFile("foo.md", "foobar"), {
      message:
        "S3 store: No secret key. Set the `secretKey` option or `S3_SECRET_KEY`.",
      status: 401,
    });
  });
});
