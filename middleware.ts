"use client"
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes} from "@/routes";
const { auth } = NextAuth(authConfig)
// @ts-ignore
export default auth((req) => {
    const {nextUrl} = req
    const isLoggedin = !!req.auth
    const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoutes = authRoutes.includes(nextUrl.pathname)
    if(isApiAuthRoutes){
        return null;
    }
    if (isAuthRoutes){
        if (isLoggedin){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return null;
    }
    if(!isLoggedin && !isPublicRoutes){
        let callbackUrl = nextUrl.pathname;
        if(nextUrl.search){
            callbackUrl+=nextUrl.search
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)
        return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`,nextUrl))
    }
    return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
   matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}