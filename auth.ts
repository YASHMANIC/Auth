import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/auth.config"
import {getUserByEmail, getUserById} from "@/data/user";
import {db} from "@/lib/db";
import {getTwoFactorConfirmationByUserId} from "@/data/two-factor-confirmation";
import {getAccountByUserId} from "@/data/account";

export const { auth,handlers:{GET,POST},signIn, signOut } = NextAuth({
  adapter:PrismaAdapter(db),
  session:{strategy:"jwt"},
  ...authConfig,
  pages:{
    signIn:'/auth/login',
    error:'/auth/error',
  },
  events:{
   async linkAccount({ user }) {
     await db.user.update({
       where:{id:user.id},
       data:{emailVerified:new Date()}
     })
   }
  },
  callbacks: {
    async signIn({user,account}){
      if(account?.provider !== "credentials") return true;
      // @ts-ignore
      const existingUser = await getUserById(user.id)
      if(!existingUser?.emailVerified) return false;
      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
        if(!twoFactorConfirmation) return false
        await db.twoFactorConfirmation.delete({
          where:{
            id:twoFactorConfirmation.id,
          }
        })
      }
      return true;
    },
     async session({token,session}){
    if(token.sub && session.user){
      session.user.id = token.sub
    }
    if(token.role && session.user){
      session.user.role = token.role
    }
    if(session.user){
      session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
    }
    if(session.user){
      // @ts-ignore
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.isOAuth = token.isOAuth as boolean;
    }
    return session;
    },
  async jwt({ token }) {
       if(!token.sub) return token
    const existingUser = await getUserById(token.sub);
       if (!existingUser) return token
    const existingAccount = await getAccountByUserId(existingUser.id)
    token.isOAuth = !!existingAccount;
    token.name = existingUser.name;
    token.email = existingUser.email;
    token.role = existingUser.role;
    token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
    return token;
  },
},
})