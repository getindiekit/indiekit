/* eslint-disable unicorn/no-useless-undefined */
import { strict as assert } from "node:assert";
import { before, after, describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import { closeServer, createSftpMockServer } from "@micham/sftp-mock-server";
import FtpStore from "../index.js";

describe("store-ftp", () => {
  const ftp = new FtpStore({
    host: "127.0.0.1",
    port: 9393,
    user: "username",
    password: "password",
  });

  const unauthorizedFtp = new FtpStore({
    host: "127.0.0.1",
    port: 9393,
    user: "foo",
    password: "foo",
  });

  let server;

  before(async () => {
    server = await createSftpMockServer({
      hostname: "127.0.0.1",
      port: "9393",
      users: { username: { password: "password" } },
    });
  });

  after(async () => {
    await closeServer(server);
  });

  it("Gets plug-in environment", () => {
    assert.deepEqual(ftp.environment, ["FTP_PASSWORD", "FTP_USER"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(ftp.name, "FTP store");
    assert.equal(ftp.info.name, "username on 127.0.0.1");
    assert.equal(ftp.info.uid, "sftp://127.0.0.1/");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(ftp.prompts[0].message, "Where is your FTP server hosted?");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({
      config: {
        plugins: ["@indiekit/store-ftp"],
        publication: { me: "https://website.example" },
        "@indiekit/store-ftp": { user: "username", host: "127.0.0.1" },
      },
    });
    await indiekit.installPlugins();
    await indiekit.bootstrap();

    assert.equal(indiekit.publication.store.info.name, "username on 127.0.0.1");
  });

  it("Throws error connecting to FTP server", async () => {
    await assert.rejects(unauthorizedFtp.readFile("foo.md"), {
      message:
        "FTP store: connect: getConnection: All configured authentication methods failed",
    });
  });

  it("Creates file", async () => {
    assert.equal(
      await ftp.createFile("foo.md", "foobar"),
      "sftp://127.0.0.1/foo.md",
    );
  });

  it("Doesn’t create file if already exists", async () => {
    await ftp.createFile("foo.md", "foobar");

    assert.equal(await ftp.createFile("foo.md", "foobar"), undefined);
  });

  it("Throws error creating file", async () => {
    await assert.rejects(ftp.createFile(undefined, ""), {
      message: `FTP store: The "path" argument must be of type string. Received undefined`,
    });
  });

  it("Reads file", async () => {
    assert.equal(await ftp.readFile("foo.md"), "foobar");
  });

  it("Throws error reading file", async () => {
    await assert.rejects(ftp.readFile(undefined), {
      message: `FTP store: The "path" argument must be of type string. Received undefined`,
    });
  });

  it("Updates file", async () => {
    assert.equal(
      await ftp.updateFile("foo.md", "foobar"),
      "sftp://127.0.0.1/foo.md",
    );
  });

  it("Updates and renames file", async () => {
    assert.equal(
      await ftp.updateFile("foo.md", "foobar", {
        newPath: "bar.md",
      }),
      "sftp://127.0.0.1/bar.md",
    );
  });

  it("Creates file if original not found", async () => {
    assert.equal(
      await ftp.updateFile("qux.md", "foobar"),
      "sftp://127.0.0.1/qux.md",
    );
  });

  it("Throws error updating file", async () => {
    await assert.rejects(ftp.updateFile(undefined, "foobar"), {
      message: `FTP store: The "path" argument must be of type string. Received undefined`,
    });
  });

  it("Deletes file", async () => {
    assert.equal(await ftp.deleteFile("foo.md"), "Successfully deleted foo.md");
  });

  it("Throws error deleting file", async () => {
    await assert.rejects(ftp.deleteFile(undefined), {
      message: `FTP store: The "path" argument must be of type string. Received undefined`,
    });
  });
});
