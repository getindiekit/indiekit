import { Express } from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      /**
       * Payload of a verified authorization code. Optional values are only
       * included when given in the authorization request.
       */
      verifiedToken: JwtPayload & {
        client_id: string;
        code_challenge?: string;
        code_challenge_method?: string;
        me: string;
        redirect_uri: string;
        scope?: string;
      };
    }
  }
}
