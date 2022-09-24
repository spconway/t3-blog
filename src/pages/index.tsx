import type { NextPage } from "next";
import Link from "next/link";
import Header from "../components/Head";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import { useUserContext } from "../context/user.context";
import { trpc } from "../utils/trpc";
import { stripHtmlFromString } from "../utils/utils";

const Home: NextPage = () => {
  const user = useUserContext()
  const {data, isLoading} = trpc.useQuery(['posts.recent-posts'])
  const mostRecentPost = data?.sort((a, b) => a.createdAt.getDate() - b.createdAt.getDate())[0]

  if(!user) {
    return <>
      <Header title="Home" />
      <LoginForm />
    </>
  }

  if(isLoading) {
    return <>
      <p>Loading...</p>
    </>
  }

  return (
    <>
      <Header title="Home" />
      <div className="flex flex-row">
        <div className="w-3/4 border p-4 ml-4 mr-2">
          <div className="text-2xl font-bold mb-2">{mostRecentPost?.title}</div>
          <div className="text-sm border-b mb-2 pb-2"><span className="font-semibold">Posted on:</span> <span className="font-light">{mostRecentPost?.createdAt.toLocaleString()}</span></div>
          {<div dangerouslySetInnerHTML={{ __html: mostRecentPost?.body || '' }} />}
        </div>
        <div className="w-1/4 border p-4 mr-4 ml-2">
          <div className="text-lg mb-2 font-bold">Recent Posts</div>
          <ol>
            {data?.map(post => {
              return (
                <li key={post.id}>
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </li>
                // <div key={post.id} className="h-12 flex flex-col">
                //   <p className="h-1/4 mb-4">
                //     <Link href={`/posts/${post.id}`}>{post.title}</Link>
                //   </p>
                  //  <div className="h-3/4 grow text-ellipsis overflow-hidden whitespace-nowrap">{stripHtmlFromString(post.body)}</div> 
                //  </div> 
              )
            })}
          </ol>
        </div>
      </div>
    </>
  )
};

export default Home;
