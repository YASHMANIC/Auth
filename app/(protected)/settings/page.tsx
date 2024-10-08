"use client"

import * as z from 'zod'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Settings} from "@/actions/settings";
import {useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SettingsSchema} from "@/schemas";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {usecurrentUser} from "@/hooks/use-current-user";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UserRole} from "@prisma/client";
import {Switch} from "@/components/ui/switch";
import {useSession} from "next-auth/react";
const SettingsPage = () =>{
      const {update} = useSession()
    const [isPending,startTranisition] = useTransition();
    const [error,setError] = useState<string|undefined>("")
    const [success,setSuccess] = useState<string|undefined>("")
    const user =  usecurrentUser();
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver:zodResolver(SettingsSchema),
        defaultValues:{
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role:user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
        }
    })
    const onSubmit = (values:z.infer<typeof SettingsSchema>) => {
        startTranisition(() =>{
          Settings(values).then((data) => {
            if(data.error){
                setError(data?.error)
            }
            if(data.success){
                update();
                setSuccess(data?.success)
            }
          }).catch(() =>{
              setError("Something Went Wrong")
          })
        })
    }
    return (
        <Card className="w-[600px]">
            <CardHeader className="text-2xl font-semibold  text-center">
                <p>
                Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                           <FormField control={form.control} name={"name"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder={"example"} />
                                </FormControl>
                            </FormItem>
                        )}
                        />
                            {user?.isOAuth === false && (
                                <>
                                     <FormField control={form.control} name={"email"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" disabled={isPending} placeholder={"example@gmail.com"} />
                                </FormControl>
                                <FormMessage/>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                             <FormField control={form.control} name={"password"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type={"password"} disabled={isPending} placeholder={"******"} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                             <FormField control={form.control} name={"newPassword"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type={"password"} disabled={isPending} placeholder={"******"} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                                </>
                            )}
                              <FormField control={form.control} name={"role"}
                        render={({field}) => (
                            <FormItem>
                               <FormLabel>Role</FormLabel>
                                <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Select a role"}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={UserRole.ADMIN}>
                                            Admin
                                        </SelectItem>
                                        <SelectItem value={UserRole.USER}>
                                            User
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                            {user?.isOAuth === false && (
                              <FormField control={form.control} name={"isTwoFactorEnabled"}
                        render={({field}) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Two Factor Authentication</FormLabel>
                                    <FormDescription>Enable Two Factor Authentication To Your Account</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch disabled={isPending} onCheckedChange={field.onChange} checked={field.value}/>
                                </FormControl>
                            </FormItem>
                        )}
                        />
                            )}
                        </div>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Button type={"submit"} size={"lg"} disabled={isPending} >
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SettingsPage