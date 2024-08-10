import {Poppins} from "next/font/google";
import {cn} from "@/lib/utils";
import {CardContent} from "@/components/ui/card";

const font = Poppins({
    subsets:["latin"],
    weight:["600"],
})

interface Header{
    label:string
}
export const Header = ({label}:Header) =>{
    return(
        <div className="flex flex-col items-center justify-center gap-y-4">
            <h1 className={cn("text-4xl text-black",font.className)}>
                Auth
            </h1>
                <p className="text-muted-foreground">{label}</p>
        </div>
    )
}