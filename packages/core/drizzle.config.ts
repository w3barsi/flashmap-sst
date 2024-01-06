import { type Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
  tablesFilter: ["flashmap_*"],
} satisfies Config;
