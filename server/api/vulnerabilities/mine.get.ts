import { db, schema } from "@nuxthub/db";
import { desc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  return db
    .select()
    .from(schema.vulnerabilities)
    .where(eq(schema.vulnerabilities.authorId, user.id))
    .orderBy(desc(schema.vulnerabilities.createdAt))
    .limit(limit)
    .offset(offset);
});
