import {db} from "@/lib/db";

export const getPasswordTokenByToken = async(token:string) =>{
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where:{token}
        });
        return passwordResetToken;
    }catch{
        return null;
    }
}

export const getPasswordTokenByEmail = async(email:string) =>{
    try {
        const passwordResetEmail = await db.passwordResetToken.findFirst({
            where:{email}
        });
        return passwordResetEmail;
    }catch{
        return null;
    }
}