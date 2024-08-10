"use client"
import * as z from "zod"
import {CardWrapper} from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {NewPasswordSchema} from "@/schemas";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {useState, useTransition} from "react";
import {useSearchParams} from "next/navigation";
import {NewPassword} from "@/actions/new-password";

export const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [isPending,startTransition] = useTransition()
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string|undefined>("")
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver:zodResolver(NewPasswordSchema),
        defaultValues:{
            password: "",
        }
    })

    const onSubmit = (values:z.infer<typeof NewPasswordSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() =>{
            NewPassword(values,token).then(async(data) => {
            setError(data?.error);
            setSuccess(data?.success)
            })
        });
    }
    return (
           <CardWrapper headerLabel={"Enter an Password"} backButtonLabel={"Back to Login"}
                        backButtonHref="/auth/login">
               <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6">
                        <div className="space-y-4">
                            <FormField name="password" control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                placeholder="*****"
                                                       type="password"
                                                       disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                            />

                        </div>
                          <FormError message={error}/>
                          <FormSuccess message={success}/>
                          <Button disabled={isPending} type="submit" className="w-full">
                              Reset Password
                          </Button>
                      </form>
               </Form>
           </CardWrapper>
    )
}