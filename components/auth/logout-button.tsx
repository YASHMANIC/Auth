"use client"
import {signOut} from "next-auth/react";

interface LogoutButtonProps{
    children?:React.ReactNode,
}

const Logout = ({children} : LogoutButtonProps) =>{
    const onClick = () =>{
        signOut()
    }
    return (
        <span onClick={onClick}>
            {children}
        </span>
    )
}
export default Logout
