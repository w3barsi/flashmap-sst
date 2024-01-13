import { SQS } from "@aws-sdk/client-sqs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { test } from "@flashmap/core/src/db/schema";

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
const sqs = new SQS({
  region: "ap-southeast-1",
});

export const testRouter = createTRPCRouter({
  getAllTests: publicProcedure.query(async ({ ctx }) => {
    const tests = await ctx.db.select().from(test);
    return tests;
  }),

  create: publicProcedure.mutation(async ({ ctx }) => {
    // simulate a slow db call
    await ctx.db.insert(test).values({
      test: String(Date.now()),
    });
  }),

  createMessage: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      await sqs.sendMessage({
        QueueUrl:
          "https://sqs.ap-southeast-1.amazonaws.com/281646808072/flashmap-queue",
        MessageBody: JSON.stringify({ message: input.message }),
      });

      console.log("SENT A MESSAGE QUEUE! ", Date.now());
    }),
});
