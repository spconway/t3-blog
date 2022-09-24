import React from "react"
import Main from "./Main";
import Navbar from "./Navbar";

export default function Layout({children}: {children:React.ReactNode}) {
    return (
        <>
            <Navbar />
            <Main>{children}</Main>
        </>
    )
}