import test from "ava";
import { MicropubEndpoint } from "../../index.js";

test("Gets mount path", (t) => {
  const result = new MicropubEndpoint();

  t.is(result.mountPath, "/micropub");
});
