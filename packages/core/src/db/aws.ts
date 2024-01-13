
import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "./schema";
import { Config } from "sst/node/config";

export const dbAws = drizzle(
  new Client({
    url: Config.DATABASE_URL,
  }).connection(),
  { schema }
);
