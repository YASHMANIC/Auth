import { Poppins } from 'next/font/google'
import {cn} from "@/lib/utils";
import {LoginButton} from "@/components/auth/login-button";
import {Button} from "@/components/ui/button";

const font = Poppins({
  subsets:['latin'],
  weight:["600"],
})
export default function Home() {

  return (
  <main className="h-full flex flex-col items-center justify-center bg-sky-700">
    <div className="space-y-6 text-center">
      <h2 className={cn("text-4xl font-semibold text-white drop-shadow-md",font.className)}>AUTH</h2>
      <p className="text-lg text-white">A Auth Purpose</p>
      <LoginButton mode={"modal"} asChild>
        <Button size="lg" variant="default">
          Sign In
        </Button>
      </LoginButton>
    </div>
  </main>
  );
}
