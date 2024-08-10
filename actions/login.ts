"use server"


import * as z from "zod";
import {LoginSchema} from "@/schemas";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import {getUserByEmail} from "@/data/user";
import {generateTokenByEmail, generateTwoFactorToken} from "@/lib/token";
import {sendTwoFactorMail, sendVerificationMail} from "@/lib/mail";
import {getTwoFactorTokenByEmail} from "@/data/two-factor-token";
import {db} from "@/lib/db";
import {getTwoFactorConfirmationByUserId} from "@/data/two-factor-confirmation";

export const login =async (values:z.infer<typeof LoginSchema>,callbackUrl?:string | null) => {
      const validateFields = LoginSchema.safeParse(values);
      if(!validateFields.success){
       return {error:"Invalid Fields"}
      }
     const {email,password,code} = validateFields.data
    const existingUser = await getUserByEmail(email);
      if(!existingUser || !existingUser.password || !existingUser.email){
          return {error:"Invalid Credentials"}
      }
      if(!existingUser.emailVerified){
          const verificationToken =await generateTokenByEmail(existingUser.email)
          await sendVerificationMail(verificationToken.email,verificationToken.token)
          return {success:"Confirmation mail sent"}
      }
      if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if(!twoFactorToken){
                return {error:"Invalid Code"}
            }
            if(twoFactorToken.token !== code){
                return {error:"Invalid Code"}
            }
            const hasExpired = new Date(twoFactorToken.expires) < new Date()
          if(hasExpired){
              return {error:"Code expired"}
          }
        await db.twoFactorToken.delete({
            where:{id:twoFactorToken.id},
        })
          const existingConfirmation =await getTwoFactorConfirmationByUserId(existingUser.id);
          if(existingConfirmation){
              await db.twoFactorConfirmation.delete({
                  where:{id:existingConfirmation.id},
              })
          }
          await db.twoFactorConfirmation.create({
              data:{
                  userId:existingUser.id,
              }
          })
      }
      else {
        if (existingUser.isTwoFactorEnabled && existingUser.email) {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorMail(
                twoFactorToken.email,
                twoFactorToken.token
            );
            return {twoFactor: true}
        }
    }
        try {
            await signIn("credentials",{
                email,
                password,
                redirectTo:callbackUrl || DEFAULT_LOGIN_REDIRECT,
            })
            return {success:"Successfully logged in"}
        }catch (error){
            if(error instanceof AuthError){
                switch (error.type){
                    case "CredentialsSignin":
                        return {error:"Invalid Credentials"}
                    default:
                        return {error:"Something Went Wrong"}
                }
            }
            throw error
        }
    }