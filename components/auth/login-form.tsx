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
import {LoginSchema} from "@/schemas";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {login} from "@/actions/login";
import {useState, useTransition} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
    const[showTwoFactor,setShowTwoFactor] = useState(false)
    const [isPending,startTransition] = useTransition()
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string|undefined>("")
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get('error') === "OAuthAccountNotLinked" ? "Email already in use with different Provider!" : ""
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver:zodResolver(LoginSchema),
        defaultValues:{
            email: "",
            password: ""
        }
    })
    const onSubmit = (values:z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() =>{
            login(values,callbackUrl).then(async(data) => {
            if(data?.error){
                form.reset();
                setError(data.error);
            }
            if(data?.success){
                form.reset();
                setSuccess(data.success);
            }
            if(data?.twoFactor){
                setShowTwoFactor(true)
            }
            }).catch(() =>setError("SomeThing Went Wrong"))
        });
    }
    return (
           <CardWrapper headerLabel={"Welcome Back"} backButtonLabel={"Don't have a Account"}
                        backButtonHref="/auth/register" showSocial>
               <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6">
                        <div className="space-y-4">
                            {showTwoFactor && (
                                <FormField name="code" control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Code</FormLabel>
                                                <FormControl>
                                                    <Input {...field}
                                                           placeholder="123456"
                                                           disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                            />
                            )}
                            {!showTwoFactor && (
                                <>
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
                                    <Button size="sm" variant={"link"} asChild className={"px-0"}>
                                        <Link href="/auth/reset">
                                            Forget Password
                                        </Link>
                                    </Button>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                                </>)
                          }
                        </div>
                          <FormError message={error || urlError}/>
                          <FormSuccess message={success}/>
                          <Button disabled={isPending} type="submit" className="w-full">
                              {showTwoFactor ? "Confirm" : "Login"}
                          </Button>
                      </form>
               </Form>
           </CardWrapper>
    )
}