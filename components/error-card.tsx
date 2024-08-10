import {CardWrapper} from "@/components/auth/card-wrapper";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";

export const ErrorCard = () => {
    return (
       <CardWrapper headerLabel={"Oops Something Went Wrong"} backButtonLabel={"Back to Login"} backButtonHref={"/auth/login"}>
           <div className="w-full flex items-center justify-center">
               <ExclamationTriangleIcon className="text-destructive"/>
           </div>
       </CardWrapper>
    );
};
