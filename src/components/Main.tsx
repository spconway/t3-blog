import React from "react"

function Main({style, children}: {style?: React.CSSProperties, children: React.ReactNode}) {
    return (
        <main
            style={style}
            className="container mx-auto"
        >
            {children}
        </main>
    )
}

export default Main