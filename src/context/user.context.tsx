import React, { createContext, useContext } from "react";
import { inferQueryOutput } from "../utils/trpc";

const UserContext = createContext<inferQueryOutput<'users.me'>>(null)

function UserContextProvider({children, value}: {
    children: React.ReactNode,
    value: inferQueryOutput<'users.me'> | undefined
}) {
    return <UserContext.Provider value={value || null}>{children}</UserContext.Provider>
}

const useUserContext = () => useContext(UserContext)

export { useUserContext, UserContextProvider }