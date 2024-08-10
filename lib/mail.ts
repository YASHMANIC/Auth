import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationMail = async (email:string,token:string) =>{
    const domain = process.env.NEXT_PUBLIC_APP_URL
    const confirmLink = `${domain}/auth/new-verfication?token=${token}`;
    await resend.emails.send({
      from: 'Auth <onboarding@resend.dev>',
      to:email,
      subject: 'Confirm Your Email',
        html:`<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`
    });
}

export const sendPasswordResetMail = async (email:string,token:string) =>{
     const domain = process.env.NEXT_PUBLIC_APP_URL
    const resetLink = `${domain}/auth/new-password?token=${token}`;
    await resend.emails.send({
      from: 'Auth <onboarding@resend.dev>',
      to:email,
      subject: 'Reset Your Password',
        html:`<p>Click <a href="${resetLink}">here</a> to Reset Password</p>`
    });
}

export const sendTwoFactorMail = async (email:string,token:string) =>{
    await resend.emails.send({
      from: 'Auth <onboarding@resend.dev>',
      to:email,
      subject: 'Your FA Code',
        html:`<p>Your FA Code was:-${token}</p>`
    });
}

