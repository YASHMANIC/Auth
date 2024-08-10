"use server"

import * as z from "zod";
import {RegisterSchema} from "@/schemas";
import {db} from "@/lib/db";
import bcrypt from "bcryptjs"
import {getUserByEmail} from "@/data/user";
import {generateTokenByEmail} from "@/lib/token";
import {sendVerificationMail} from "@/lib/mail";
export const Register =async (values:z.infer<typeof RegisterSchema>) => {
      const validateErrors = RegisterSchema.safeParse(values);
      if(!validateErrors.success){
       return {error:"Invalid Fields"}
      }
      const {name,email,password} = validateErrors.data
      const existingEmail =await getUserByEmail(email)
    if(existingEmail){
        return {error:"Email already exist"}
    }
    const hashedPassword = await bcrypt.hash(password, 12);
     await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
        }
    })
    const verificationToken = await generateTokenByEmail(email)
    await sendVerificationMail(verificationToken.email,verificationToken.token);
      return {success:"Confirmation mail Sent!"}
    }