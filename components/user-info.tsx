import {ExtendedUser} from "@/next-auth-d";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

interface UserInfoProps{
    user?:ExtendedUser,
    label:string
}

export const UserInfo = ({user,label}:UserInfoProps) => {
    return(
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">{label}</p>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between rounded-lg p-3 border shadow-sm">
                <p className="text-sm font-bold">Id</p>
                <p className="truncate max-w-[180px] p-1 text-xs font-mono bg-slate-100 rounded-md">{user?.id}</p>
            </CardContent>
             <CardContent className="flex flex-row items-center justify-between rounded-lg p-3 border shadow-sm">
                <p className="text-sm font-bold">Name</p>
                <p className="truncate max-w-[180px] p-1 text-xs font-mono bg-slate-100 rounded-md">{user?.name}</p>
            </CardContent>
             <CardContent className="flex flex-row items-center justify-between rounded-lg p-3 border shadow-sm">
                <p className="text-sm font-bold">Email</p>
                <p className="truncate max-w-[180px] p-1 text-xs font-mono bg-slate-100 rounded-md">{user?.email}</p>
            </CardContent>
             <CardContent className="flex flex-row items-center justify-between rounded-lg p-3 border shadow-sm">
                <p className="text-sm font-bold">Role</p>
                <p className="truncate max-w-[180px] p-1 text-xs font-mono bg-slate-100 rounded-md">{user?.role}</p>
            </CardContent>
             <CardContent className="flex flex-row items-center justify-between rounded-lg p-3 border shadow-sm">
                <p className="text-sm font-bold">Two Factor Authentication</p>
                 <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>{user?.isTwoFactorEnabled ? "On" : "Off"}</Badge>
            </CardContent>
        </Card>
    )
}
