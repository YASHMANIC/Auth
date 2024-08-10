import * as z from 'zod'
import {UserRole} from "@prisma/client";

export const SettingsSchema = z.object({
    name:z.optional(z.string()),
    isTwoFactorEnabled:z.optional(z.boolean()),
    role:z.enum([UserRole.ADMIN,UserRole.USER]),
    email:z.optional(z.string().email()),
    password:z.optional(z.string().min(6)),
    newPassword:z.optional(z.string().min(6)),
}).refine((data) => {
    if (data.password && !data.newPassword){
        return false;
    }
    return true;
},{
    message:"New Password is Required",
    path:["newPassword"]
}).refine((data) => {
    if (data.newPassword && !data.password){
        return false;
    }
    return true;
},{
    message:"Password is Required",
    path:["password"]
})


export const NewPasswordSchema = z.object({
       password:z.string().min(6,{
        message:"Minimum 6 characters required"
    }),
})

export const ResetSchema = z.object({
    email:z.string().email({
        message:"Email is Required"
    })
})

export const LoginSchema = z.object({
    email:z.string().email({
        message:"Email is Required"
    }),
    password:z.string().min(1,{
        message:"Password is Required"
    }),
    code:z.optional(z.string())
})


export const RegisterSchema = z.object({
    email:z.string().email({
        message:"Email is Required"
    }),
    password:z.string().min(6,{
        message:"Minimum 6 characters required"
    }),
    name:z.string().min(3,{
        message:"Name is Required"
    })
})