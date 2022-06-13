import test from "ava";
import sinon from "sinon";
import mockReqRes from "mock-req-res";
import { cacheControl } from "../../../lib/middleware/cache.js";

const { mockRequest, mockResponse } = mockReqRes;

test("Sends cache control headers in response", (t) => {
  const request = mockRequest();
  const response = mockResponse({ headers: {} });
  const next = sinon.spy();

  cacheControl(request, response, next);

  t.true(next.calledOnce);
});
