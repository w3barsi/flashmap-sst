import { SQS } from "@aws-sdk/client-sqs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { test } from "@flashmap/core/src/db/schema";
import { z } from "zod";

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
const sqs = new SQS({
  region: "us-east-1",
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
        QueueUrl: process.env.QUEUE_LINK,
        MessageBody: JSON.stringify({ message: input.message }),
      });

      console.log("SENT A MESSAGE QUEUE! ", Date.now());
    }),
});
