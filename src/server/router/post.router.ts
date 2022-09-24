import { TRPCError } from "@trpc/server";
import { createPostSchema, getSinglePostSchema } from "../../schema/post.schema";
import { createRouter } from "./context";

export const postRouter = createRouter()
.mutation('create-post', {
    input: createPostSchema,
    resolve: async ({ctx, input}) => {
        if(!ctx.user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Can not create a post while logged out',
            })
        }

        const post = await ctx.prisma.post.create({
            data: {
                ...input,
                user: {
                    connect: {
                        id: ctx.user.id
                    }
                }
            }
        })

        return post
    }
}).query('posts', {
    resolve: ({ctx}) => {
        return ctx.prisma.post.findMany()
    }
}).query('single-post', {
    input: getSinglePostSchema,
    resolve: ({ctx, input}) => {
        return ctx.prisma.post.findUnique({
            where: {
                id: input.postId
            }
        })
    }
}).query('recent-posts', {
    resolve: ({ctx}) => {
        return ctx.prisma.post.findMany({
            where: {
                createdAt: {
                    gte: new Date("2022-01-01")
                }
            }
        })
    }
})