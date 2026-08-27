import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

import { getCliResult, parseCliArguments, usage } from "../../lib/cli.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");

describe("create-indiekit/lib/cli", () => {
  it("Parses a directory", () => {
    const result = parseCliArguments(["myproject"]);

    assert.equal(result.directory, "myproject");
    assert.equal(result.help, false);
    assert.equal(result.version, false);
    assert.equal(result.unknownOption, undefined);
  });

  it("Parses help and version options", () => {
    assert.equal(parseCliArguments(["--help"]).help, true);
    assert.equal(parseCliArguments(["-h"]).help, true);
    assert.equal(parseCliArguments(["--version"]).version, true);
    assert.equal(parseCliArguments(["-v"]).version, true);
  });

  it("Reports an unrecognised option by name", () => {
    assert.equal(parseCliArguments(["--foo"]).unknownOption, "foo");
    assert.equal(
      parseCliArguments(["--foo", "myproject"]).unknownOption,
      "foo",
    );
  });

  it("Shows usage", () => {
    const result = getCliResult(parseCliArguments(["--help"]));

    assert.equal(result.code, 0);
    assert.equal(result.message, usage);
  });

  it("Shows version number", () => {
    const result = getCliResult(parseCliArguments(["--version"]));

    assert.equal(result.code, 0);
    assert.equal(result.message, version);
  });

  it("Rejects an unrecognised option", () => {
    const result = getCliResult(parseCliArguments(["--foo"]));

    assert.equal(result.code, 1);
    assert.match(result.message, /Unknown option: --foo/);
  });

  it("Asks for a directory before any questions are asked", () => {
    const result = getCliResult(parseCliArguments([]));

    assert.equal(result.code, 1);
    assert.match(result.message, /Provide a directory/);
  });

  it("Runs setup when given a directory", () => {
    assert.equal(getCliResult(parseCliArguments(["myproject"])), false);
  });

  it("Does not treat an option as the directory to create", () => {
    // `base-create` takes `process.argv[2]` verbatim, so an unhandled option
    // would otherwise become the name of the scaffolded directory.
    for (const option of ["--help", "--version", "--foo"]) {
      assert.notEqual(parseCliArguments([option]).directory, option);
    }
  });
});
