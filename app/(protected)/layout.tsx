import Navbar from "@/app/(protected)/_components/navbar";

interface ProtectedLayoutProps{
    children: React.ReactNode;
}

 const ProtectedLayout = ({children}:ProtectedLayoutProps) => {
    return(
        <div className="w-full h-full flex flex-col gap-y-10 items-center justify-center bg-sky-700">
            <Navbar/>
            {children}
        </div>
    )
}
export default ProtectedLayout