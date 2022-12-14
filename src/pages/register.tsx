import Link from "next/link"
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

function RegisterPage() {

    const router = useRouter()

    const {handleSubmit, register} = useForm<CreateUserInput>()

    const {mutate, error} = trpc.useMutation(['user.register-user'], {
        onSuccess: () => {
            router.push('/login')
        }
    })

    function onSubmit(values: CreateUserInput) {
        mutate(values);
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && error.message}

            <h1>Register</h1>

            <input type='email' placeholder='foo.bar@example.com' {...register('email')} />
            <br />
            <input type='text' placeholder='Steve' {...register('name')} />

            <button type='submit'>Register</button>

        </form>

        <Link href='/login'>Login</Link>
    </>
}

export default RegisterPage