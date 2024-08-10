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
import {RegisterSchema} from "@/schemas";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {Register} from "@/actions/register";
import {useState, useTransition} from "react";

export const RegisterForm = () => {
    const [isPending,startTransition] = useTransition()
    const [error,setError] = useState<string | undefined>("");
    const [sucess,setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver:zodResolver(RegisterSchema),
        defaultValues:{
            email: "",
            password: "",
            name:""
        }
    })
    const onSubmit = (values:z.infer<typeof RegisterSchema>) => {
        startTransition(()=>{
            Register(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);
            })
        })
    }
    return (
           <CardWrapper headerLabel={"Create an Account"} backButtonLabel={"Already have a Account"}
                        backButtonHref="/auth/login" showSocial>
               <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6">
                        <div className="space-y-4">
                            <FormField name="name" control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                placeholder="Example"
                                                       disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                            />
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
                             <FormField name="password" control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                placeholder="******"
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
                          <FormSuccess message={sucess}/>
                          <Button disabled={isPending} type="submit" className="w-full">
                              Register
                          </Button>
                      </form>
               </Form>
           </CardWrapper>
    )
}