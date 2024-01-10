import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { test } from "@flashmap/core/src/db/schema";

export const testRouter = createTRPCRouter({
  getAllTests: publicProcedure
    .query(async ({ ctx }) => {
      const tests = await ctx.db.select().from(test);
      return tests;
    }),

  create: publicProcedure
    .mutation(async ({ ctx }) => {
      // simulate a slow db call
      console.time("insert")
      await ctx.db.insert(test).values({
        test: String(Date.now())
      });
      console.timeEnd("insert")
    }),
});
