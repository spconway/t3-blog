import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";
import { getBaseUrl } from "../../constants";
import { createUserOutputSchema, createUserSchema, requestOtpSchema, verifyOtpSchema } from "../../schema/user.schema";
import { decode, encode } from "../../utils/base64";
import { signJwt } from "../../utils/jwt";
import { sendLoginEmail } from "../../utils/mailer";
import { createRouter } from "./context";

export const userRouter = createRouter()
.mutation('register-user', {

    input: createUserSchema,

    // meant to demonstrate the output option
    // but output cannot be combined with resolve
    // output: createUserOutputSchema,

    resolve: async ({ctx, input}) => {

        const {email, name} = input;

        try {
        
            const user = await ctx.prisma.user.create({
                data: {email, name}
            })

            return user
            
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError)
            {
                if(error.code === 'P2002') {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'User already exists'
                    })
                }
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Something went wrong"
            })
        }

    }
}).mutation('request-otp', {

    input: requestOtpSchema,

    resolve: async ({ctx, input}) => {

        const {email, redirect} = input

        const user = await ctx.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found'
            })
        }

        const token = await ctx.prisma.verificationToken.create({
            data: {
                redirect,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        await sendLoginEmail({
            token: encode(`${token.id}:${user.email}`),
            url: `http://localhost:${process.env.PORT ?? 3000}`,
            email: user?.email!
        })

        return true
    }

}).query('verify-otp', {
    input: verifyOtpSchema,
    resolve: async ({ctx, input}) => {
        const decoded = decode(input.hash).split(':')

        const [id, email] = decoded

        const token = await ctx.prisma.verificationToken.findFirst({
            where: {
                id,
                user: {
                    email
                }
            },
            include: {
                user: true,
            }
        })

        if(!token) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Invalid token'
            })
        }

        // ommit sensitive data...
        const jwt = signJwt(token.user)

        ctx.res.setHeader('Set-Cookie', serialize('token', jwt, {path: '/'}))

        return {
            redirect: token.redirect,
        }
    }
}).query('me', {
    resolve: ({ctx}) => {
        return ctx.user
    }
})