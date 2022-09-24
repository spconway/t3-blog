import Head from "next/head"

function Header({title=`${process.env.APP_HEADER || 'NextJS App'}`, description=''}: {title?: string, description?: string}) {
    return (
        <Head>
            <title>{title}</title>
            <meta name='description' content={description} />
        </Head>
    )
}

export default Header