"use server"

import {getVerficationByToken} from "@/data/verification-token";
import {getUserByEmail} from "@/data/user";
import {db} from "@/lib/db";

export const newVerfication =async (token:string) => {
    const existingToken = await getVerficationByToken(token);
    if(!existingToken){
        return {error:"No verification token"};
    }
    const hasExpired = new Date(existingToken.expires) < new Date()
    if(hasExpired){
        return {error:"Token Has Expired"}
    }
    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser){
        return {error:"No user with that email"};
    }
    await db.user.update({
        where:{id:existingUser.id},
        data:{
            emailVerified:new Date(),
            email:existingToken.email
        }
    })
    await db.verficationToken.delete({
        where:{id:existingToken.id},
    });
    return {success:"Email verified successfully."};
}