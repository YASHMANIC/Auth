"use client"

import {UserInfo} from "@/components/user-info";
import {usecurrentUser} from "@/hooks/use-current-user";

const ServerPage = () => {
    const user = usecurrentUser()
    return(
        <UserInfo label={"Client Component"} user={user}/>
    )
}
export default ServerPage