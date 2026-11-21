import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { cleanStack } from "../index.js";

/**
 * Build a stack trace from a message and frames
 * @param {string} message - First line of the stack
 * @param {string[]} frames - Frames, without the `    at ` prefix
 * @returns {string} Stack trace
 */
const stackOf = (message, frames) =>
  [message, ...frames.map((frame) => `    at ${frame}`)].join("\n");

describe("error/clean-stack", () => {
  it("Removes Node.js internal frames with a function name", () => {
    const stack = stackOf("Error: Message", [
      "handler (/app/lib/handler.js:10:5)",
      "process.processTicksAndRejections (node:internal/process/task_queues:105:5)",
    ]);

    assert.equal(
      cleanStack(stack),
      stackOf("Error: Message", ["handler (/app/lib/handler.js:10:5)"]),
    );
  });

  it("Removes Node.js internal frames without a function name", () => {
    const stack = stackOf("Error: Message", [
      "handler (/app/lib/handler.js:10:5)",
      "node:internal/main/run_main_module:33:47",
    ]);

    assert.equal(
      cleanStack(stack),
      stackOf("Error: Message", ["handler (/app/lib/handler.js:10:5)"]),
    );
  });

  it("Removes async and constructor Node.js frames", () => {
    const stack = stackOf("Error: Message", [
      "handler (/app/lib/handler.js:10:5)",
      "async node:internal/modules/esm/loader:647:26",
      "new Promise (node:internal/promise:1:1)",
      "async Promise.all (node:internal/promise:2:2)",
    ]);

    assert.equal(
      cleanStack(stack),
      stackOf("Error: Message", ["handler (/app/lib/handler.js:10:5)"]),
    );
  });

  it("Removes frames from Node.js built-in modules", () => {
    const stack = stackOf("Error: Message", [
      "handler (/app/lib/handler.js:10:5)",
      "EventEmitter.emit (node:events:519:28)",
      "Object.openSync (node:fs:573:18)",
    ]);

    assert.equal(
      cleanStack(stack),
      stackOf("Error: Message", ["handler (/app/lib/handler.js:10:5)"]),
    );
  });

  it("Keeps application and dependency frames in order", () => {
    const frames = [
      "handler (/app/lib/handler.js:10:5)",
      "Layer.handle (/app/node_modules/express/lib/router/layer.js:95:5)",
      "async file:///app/index.js:3:1",
      String.raw`C:\app\lib\handler.js:10:5`,
      "fn (C:/Program Files (x86)/app/index.js:1:1)",
    ];
    const stack = stackOf("Error: Message", [
      frames[0],
      "process.processTicksAndRejections (node:internal/process/task_queues:105:5)",
      ...frames.slice(1),
    ]);

    assert.equal(cleanStack(stack), stackOf("Error: Message", frames));
  });

  it("Keeps message lines that are not frames", () => {
    const message = [
      "Error: Cannot load node:sqlite",
      "Check that at least one plug-in is enabled",
      "    at least, it should be",
    ].join("\n");
    const stack = stackOf(message, [
      "handler (/app/lib/handler.js:10:5)",
      "node:internal/main/run_main_module:33:47",
    ]);

    assert.equal(
      cleanStack(stack),
      stackOf(message, ["handler (/app/lib/handler.js:10:5)"]),
    );
  });

  it("Returns full stack if every frame is internal", () => {
    const stack = stackOf("Error: read ECONNRESET", [
      "TLSWrap.onStreamRead (node:internal/stream_base_commons:216:20)",
      "process.processTicksAndRejections (node:internal/process/task_queues:105:5)",
    ]);

    assert.equal(cleanStack(stack), stack);
  });

  it("Returns stack without frames unchanged", () => {
    const stack = "Error: ENOENT: no such file or directory, open '/missing'";

    assert.equal(cleanStack(stack), stack);
  });

  it("Returns empty or missing stack unchanged", () => {
    assert.equal(cleanStack(), undefined);
    assert.equal(cleanStack(""), "");
  });

  it("Cleans stack of an error created inside a Node.js callback", () => {
    const target = new EventTarget();
    let error = new Error("Not dispatched");
    target.addEventListener("event", () => {
      error = new Error("Dispatched");
    });
    target.dispatchEvent(new Event("event"));

    const result = cleanStack(error.stack) || "";

    assert.match(String(error.stack), /\(node:internal\/event_target:/);
    assert.match(result, /^Error: Dispatched/);
    assert.match(result, /clean-stack\.js/);
    assert.doesNotMatch(result, /\(node:|at node:/);
  });
});
