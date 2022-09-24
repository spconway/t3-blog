import Link from "next/link"
import Header from "../../components/Head"
import Main from "../../components/Main"
import { trpc } from "../../utils/trpc"

function PostListingPage(){
    const {data, isLoading} = trpc.useQuery(['posts.posts'])

    if(isLoading) {
        return <p>Loading posts...</p>
    }

    return (<>
        <Header title="Posts" />
        <div>{data?.map(post => {
            return (
                <article key={post.id}>
                    <p>{post.title}</p>
                    <Link href={`/posts/${post.id}`}>Read post</Link>
                </article>
            )
        })}</div>
        </>
    )
}

export default PostListingPage