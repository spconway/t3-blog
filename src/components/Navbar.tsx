import Link from "next/link"

function Navbar() {
    return (
        <div className="h-24 mb-4 border-b">
            <div className="h-full mx-8 flex justify-between items-center">
                <div className="flex flex-column">
                    <div>
                        <Link href="/">Home</Link>
                    </div>
                </div>
                <div className="flex flex-column">
                    <div className="w-24 mx-1 text-center"><Link href="/posts">Posts</Link></div>
                    <div className="w-24 mx-1 text-center"><Link href="/posts/new">Create Post</Link></div>
                </div>
            </div>
        </div>
    )
}

export default Navbar