import { Express } from "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      verifiedToken: {
        client_id: string;
        code_challenge: string;
        code_challenge_method: string;
        jti: string;
        me: string;
        redirect_uri: string;
        scope: string;
        iat: number;
        exp: number;
      };
    }
  }
}
