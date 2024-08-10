import {NextResponse} from "next/server";
import {useCurrentRole} from "@/hooks/use-current-role";
import {UserRole} from "@prisma/client";
import {currentRole} from "@/lib/auth";

export async function GET(){
    const role = await currentRole();
    if(role === UserRole.ADMIN){
        return new NextResponse(null,{status:200})
    }
    return new NextResponse(null,{status:403})
}