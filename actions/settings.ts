"use server"
import * as z from "zod"
import {SettingsSchema} from "@/schemas";
import {currentUser} from "@/lib/auth";
import {getUserByEmail, getUserById} from "@/data/user";
import {db} from "@/lib/db";
import {generateTwoFactorToken} from "@/lib/token";
import {sendVerificationMail} from "@/lib/mail";
import bcrypt from "bcryptjs";

export const Settings = async (values:z.infer<typeof SettingsSchema>) => {

    const user = await currentUser();
    if(!user){
        return {error:"Unauthorized"}
    }
    // @ts-ignore
    const dbUser = await getUserById(user?.id);
    if(!dbUser){
        return {error:"Unauthorized"}
    }
    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }
    if(values.email && values.email!==user.email){
        const existingUser = await getUserByEmail(values.email);
        if(existingUser && existingUser.id!==user.id){
            return {error:"Email Already in use"};
        }
        // @ts-ignore
            const verficationToken = await generateTwoFactorToken(values.email);
        await sendVerificationMail(verficationToken.email,verficationToken.token);
        return {success:"Confirmation email sent"}
    }
    if(values.password && values.newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(values.password,dbUser.password);
        if(!passwordsMatch){
            return {error:"Invalid Password"}
        }
        const hashPassword = await bcrypt.hash(values.newPassword,12);
        values.password = hashPassword;
        values.newPassword = undefined;
    }
    const newUser = await db.user.update({
        where:{
            id:dbUser.id
        },
        data:{
            ...values
        }
    });

    return {success:"Settings Updated"}
}