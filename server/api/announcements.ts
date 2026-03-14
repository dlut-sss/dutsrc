import { db, schema } from "@nuxthub/db";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  return db
    .select()
    .from(schema.announcements)
    .orderBy(
      desc(schema.announcements.pinned),
      desc(schema.announcements.createdAt),
    );
});
