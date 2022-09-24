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
      {data?.map(post => {
        return (
          <div key={post.id} className="h-24 flex flex-col">
            <p className="h-1/4 mb-4">
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </p>
            <div className="h-3/4 grow text-ellipsis overflow-hidden whitespace-nowrap">{stripHtmlFromString(post.body)}</div>
          </div>
        )
      })}
    </>
  )
};

export default Home;
