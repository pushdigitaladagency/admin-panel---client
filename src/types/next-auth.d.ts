import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      permissions: string[];
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    roles?: string[];
    permissions?: string[];
    firstName?: string | null;
    lastName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    roles?: string[];
    permissions?: string[];
    firstName?: string;
    lastName?: string;
  }
}
