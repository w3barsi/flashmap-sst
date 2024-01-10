import { init } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

import { createId } from "~/utils/id";

// export const createDbId = () => {
//   const createId = init({
//     length: 12,
//   });
//   return createId();
// };

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `flashmap_${name}`);

export const test = mysqlTable("test", {
  test: text("test")
})

export const mindmap = mysqlTable("mindmap", {
  markdown: text("markdown").notNull(),
  threadId: varchar("threadId", { length: 255 }).notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const flashcard = mysqlTable("flashcard", {
  keyword: text("keyword").notNull(),
  definition: text("definition").notNull(),
  threadId: varchar("threadId", { length: 255 }).notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const threads = mysqlTable("thread", {
  id: varchar("id", { length: 255 }),
  title: varchar("title", { length: 255 }),
  isDeleted: boolean("isDeleted").default(false),
  hasCard: boolean("hasCard").default(false),
  hasMindmap: boolean("hasMindmap").default(false),

  createdBy: varchar("uploadedBy", { length: 255 }).notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const files = mysqlTable(
  "file",
  {
    key: varchar("key", { length: 255 }).primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    uploadedBy: varchar("uploadedBy", { length: 255 }).notNull(),
    threadId: varchar("threadId", { length: 255 }),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (file) => ({
    id: index("id_idx").on(file.key),
  }),
);

export const fileRelations = relations(files, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [files.uploadedBy],
    references: [users.id],
  }),
}));

// export const fileRelations = relations(files, ({ one }) => ({
//   uploadedBy: one(users, {
//     fields: [files.uploadedBy],
//     references: [users.id],
//     relationName: "uploadedBy"
//   }),
// }));

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  cellNumber: varchar("cellNumber", { length: 13 }),
  role: mysqlEnum("role", ["admin", "employee", "customer"]).default(
    "customer",
  ),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  files: many(files),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
