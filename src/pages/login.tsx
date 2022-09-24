import dynamic from "next/dynamic";
import Header from "../components/Head";
import Main from "../components/Main";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
    ssr: false
})

function LoginPage() {
    return (
        <>
            <Header title="Login" />
            <LoginForm />
        </>
    )
}

export default LoginPage