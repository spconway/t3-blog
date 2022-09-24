// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { verifyJwt } from "../../utils/jwt";
import { prisma } from "../db/client";

/* https://www.youtube.com/watch?v=syEWlxVFUrY&t=2224 */
interface CtxUser {
  id: string
  email: string
  name: string
  iat: string
  exp: number
}

function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token

  if(token) {
    try {
      const verified = verifyJwt<CtxUser>(token)
      return verified
    } catch (error) {
      return null
    }
  }

  return null
}
/* */

type CreateContextOptions = {
  session: Session | null;
  // TODO: remove the following when configuring next-auth
  req: NextApiRequest;
  res: NextApiResponse;
  user: CtxUser | null;
};

/** Use this helper for:
 * - testing, where we dont have to Mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    // TODO: remove the following when configuring next-auth
    req: opts.req,
    res: opts.res,
    user: opts.user,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  const user = getUserFromRequest(req)

  // TODO: remove req, res when configuring next-auth
  return await createContextInner({
    session,
    req,
    res,
    user
  });
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 **/
export function createProtectedRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `session` is non-nullable to downstream resolvers
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
}
