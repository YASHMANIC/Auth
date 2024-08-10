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
import {ResetSchema} from "@/schemas";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {useState, useTransition} from "react";
import {reset} from "@/actions/reset";

export const ResetForm = () => {
    const [isPending,startTransition] = useTransition()
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string|undefined>("")
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver:zodResolver(ResetSchema),
        defaultValues:{
            email: "",
        }
    })

    const onSubmit = (values:z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() =>{
            reset(values).then(async(data) => {
            setError(data?.error);
            setSuccess(data?.success)
            })
        });
    }
    return (
           <CardWrapper headerLabel={"Forget an Password"} backButtonLabel={"Back to Login"}
                        backButtonHref="/auth/login">
               <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6">
                        <div className="space-y-4">
                            <FormField name="email" control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                placeholder="Example@example.com"
                                                       type="email"
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
                              Send Reset Email
                          </Button>
                      </form>
               </Form>
           </CardWrapper>
    )
}