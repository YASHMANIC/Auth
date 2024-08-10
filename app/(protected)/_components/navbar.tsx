"use client"
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {UserButton} from "@/components/auth/user-button";

const Navbar = () => {
    const pathName = usePathname()
    return (
        <nav className="bg-secondary flex justify-between items-center rounded-xl p-4 w-[600px] shadow-md">
            <div className="flex gap-y-2">
                <Button asChild variant={pathName === '/server' ? "default" : "outline"}>
                <Link href={"/server"}>
                    Server
                </Link>
            </Button>
                <Button asChild variant={pathName === '/client' ? "default" : "outline"}>
                <Link href={"/client"}>
                    Client
                </Link>
            </Button>
                <Button asChild variant={pathName === '/admin' ? "default" : "outline"}>
                <Link href={"/admin"}>
                    Admin
                </Link>
            </Button>
                <Button asChild variant={pathName === '/settings' ? "default" : "outline"}>
                <Link href={"/settings"}>
                    Settings
                </Link>
            </Button>
            </div>
            <p><UserButton/> </p>
        </nav>
    )
}
export default Navbar