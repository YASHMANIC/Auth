import  { type DefaultSession } from "next-auth"


export type ExtendedUser = DefaultSession['user'] & {
    role:'ADMIN' | 'USER',
    isTwoFactorEnabled:boolean,
    isOAuth:boolean,
}

declare module "next-auth" {
    interface Session{
        user: ExtendedUser
    }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role?: 'ADMIN'| "USER"
  }
}