import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import FtpStore from "../index.js";

const ftp = new FtpStore({
  host: "ftp.server.example",
  user: "username",
  password: "password",
});

test("Gets plug-in info", (t) => {
  t.is(ftp.name, "FTP store");
  t.is(ftp.info.name, "username on ftp.server.example");
  t.is(ftp.info.uid, "sftp://ftp.server.example/");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(ftp.prompts[0].message, "Where is your FTP server hosted?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  ftp.init(indiekit);

  t.is(indiekit.publication.store.info.name, "username on ftp.server.example");
});
