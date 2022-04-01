import test from "ava";
import sinon from "sinon";
import mockReqRes from "mock-req-res";
import { defaultConfig } from "../../../config/defaults.js";
import { forceHttps } from "../../../lib/middleware/force-https.js";

const { mockRequest, mockResponse } = mockReqRes;

test("Redirect HTTP requests to HTTPS", async (t) => {
  const request = mockRequest({
    headers: {
      "x-forwarded-proto": "http",
      Host: "server.example"
    },
    originalUrl: '/foo?bar=qux'
  });
  const response = mockResponse();
  const next = sinon.spy();

  await forceHttps(request, response, next);

  t.true(response.redirect.calledWith(302));
});
