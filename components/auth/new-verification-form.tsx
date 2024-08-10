"use client"
import {CardWrapper} from "@/components/auth/card-wrapper";
import {useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {BeatLoader} from "react-spinners";
import {newVerfication} from "@/actions/new-verfication";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";

const NewVerificationForm = () => {
    const searchParams  = useSearchParams();
    const [error,setError] = useState<string | undefined>();
    const [success,setSuccess] = useState<string|undefined>()
    const token = searchParams.get("token");
    const onSubmit = useCallback(()=>{
        if(!token){
            setError("Missing token");
            return
        }
        newVerfication(token).then((data) => {
            setError(data?.error);
            setSuccess(data?.success)
        }).catch(()=>{
            setError("Something went wrong");
        })
    },[token])
    useEffect(() => {
        onSubmit()
    }, [onSubmit]);
    return(
        <CardWrapper headerLabel={"Confirming Your Email"} backButtonLabel={"Back to Login"} backButtonHref={"/auth/login"}>
        <div className="flex items-center justify-center w-full">
            {!success && !error &&
            (<BeatLoader/>)
            }
            <FormError message={error}/>
            <FormSuccess message={success}/>
        </div>
        </CardWrapper>
    )
}
export default NewVerificationForm