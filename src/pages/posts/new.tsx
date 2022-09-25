import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useForm, FormProvider } from "react-hook-form"
import Header from "../../components/Head"
import Main from "../../components/Main"
import TinyMCEEditor from "../../components/TinyMCEEditor"
import { CreatePostInput } from "../../schema/post.schema"
import { trpc } from "../../utils/trpc"

// const TinyMCEEditor = dynamic(() => import("../../components/TinyMCEEditor"), {
//     ssr: false
// })

function CreatePostPage() {

    const router = useRouter()

    const methods = useForm<CreatePostInput>({
        defaultValues: {},
        mode: "onChange"
    })

    const {mutate, error} = trpc.useMutation(['posts.create-post'], {
        onSuccess({id}) {
            router.push(`/posts/${id}`)
        }
    })

    function onSubmit(values: CreatePostInput) {
        mutate(values)
    }

    return <>
        <Header title="New Post" />
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {error && error.message}

                <h1>Create posts</h1>
                <br />
                <br />
                <input type='text' placeholder="Your post title" {...methods.register('title')} />
                <br />
                <TinyMCEEditor
                    control={methods.control}
                    name="body"
                />
                <br />
                <button>Create post</button>
            </form>
        </FormProvider>
    </>
}

export default CreatePostPage