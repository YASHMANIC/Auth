"use server"
import * as z from "zod"
import {ResetSchema} from "@/schemas";
import {getUserByEmail} from "@/data/user";
import {generateResetPasswordToken} from "@/lib/token";
import {sendPasswordResetMail} from "@/lib/mail";
export const reset =async (values:z.infer<typeof ResetSchema>) =>{
        const validateFields = ResetSchema.safeParse(values);
        if(!validateFields.success){
            return {error:"Invalid email"}
        }
        const {email} = validateFields.data
    const existingUser = await getUserByEmail(email);
        if(!existingUser){
            return {error:"Email Not Found"}
        }
        const ResetverificationToken =await generateResetPasswordToken(email);
            await sendPasswordResetMail(ResetverificationToken.email,ResetverificationToken.token);
        return{success:"Reset Email Sent"}
}