import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null;
    }
  }
}

// Extend express-session types to include userId
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}
