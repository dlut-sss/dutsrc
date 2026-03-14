import { db, schema } from "@nuxthub/db";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  return db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      role: schema.users.role,
      points: schema.users.pointsTotal,
    })
    .from(schema.users)
    .orderBy(desc(schema.users.pointsTotal))
    .limit(limit)
    .offset(offset);
});
