import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { closeServer, createSftpMockServer } from "@micham/sftp-mock-server";
import FtpStore from "../index.js";

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

test.before(async (t) => {
  t.context.server = await createSftpMockServer({
    hostname: "127.0.0.1",
    port: 9393,
    users: { username: { password: "password" } },
  });
});

test.after(async (t) => {
  await closeServer(t.context.server);
});

test("Gets plug-in environment", (t) => {
  t.deepEqual(ftp.environment, ["FTP_PASSWORD", "FTP_USER"]);
});

test("Gets plug-in info", (t) => {
  t.is(ftp.name, "FTP store");
  t.is(ftp.info.name, "username on 127.0.0.1");
  t.is(ftp.info.uid, "sftp://127.0.0.1/");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(ftp.prompts[0].message, "Where is your FTP server hosted?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  ftp.init(indiekit);

  t.is(indiekit.publication.store.info.name, "username on 127.0.0.1");
});

test("Throws error connecting to FTP server", async (t) => {
  await t.throwsAsync(unauthorizedFtp.readFile("foo.md"), {
    message:
      "FTP store: connect: getConnection: All configured authentication methods failed",
  });
});

test.serial("Creates file", async (t) => {
  t.is(
    await ftp.createFile("foo.md", "foobar"),
    "Uploaded data stream to foo.md",
  );
});

test("Throws error creating file", async (t) => {
  await t.throwsAsync(ftp.createFile(), {
    message: `FTP store: The "path" argument must be of type string. Received undefined`,
  });
});

test.serial("Reads file", async (t) => {
  t.is(await ftp.readFile("foo.md"), "foobar");
});

test("Throws error reading file", async (t) => {
  await t.throwsAsync(ftp.readFile(), {
    message: `FTP store: The "path" argument must be of type string. Received undefined`,
  });
});

test.serial("Updates file", async (t) => {
  t.is(
    await ftp.updateFile("foo.md", "foobar"),
    "Uploaded data stream to foo.md",
  );
});

test("Updates and renames file", async (t) => {
  t.is(
    await ftp.updateFile("foo.md", "foobar", {
      newPath: "bar.md",
    }),
    "Successfully renamed foo.md to bar.md",
  );
});

test("Creates file if original not found", async (t) => {
  t.is(
    await ftp.updateFile("qux.md", "foobar"),
    "Uploaded data stream to qux.md",
  );
});

test("Throws error updating file", async (t) => {
  await t.throwsAsync(ftp.updateFile(undefined, "foobar"), {
    message: `FTP store: The "path" argument must be of type string. Received undefined`,
  });
});

test("Deletes file", async (t) => {
  t.is(await ftp.deleteFile("foo.md"), "Successfully deleted foo.md");
});

test("Throws error deleting file", async (t) => {
  await t.throwsAsync(ftp.deleteFile(), {
    message: `FTP store: The "path" argument must be of type string. Received undefined`,
  });
});
