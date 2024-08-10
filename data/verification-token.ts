import {db} from "@/lib/db";

export const getVerficationByToken = async (token: string) => {
    try {
        const verificationToken =  await db.verficationToken.findUnique({
            where: { token }
        })
        return verificationToken;
    }
    catch {
        return null;
    }
}

export const getVerficationByEmail = async (email: string) => {
    try {
        const verificationToken =  await db.verficationToken.findFirst({
            where: { email }
        })
        return verificationToken;
    }
    catch {
        return null;
    }
}