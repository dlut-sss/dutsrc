import { db, schema } from "@nuxthub/db";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  return db
    .select({
      id: schema.teams.id,
      name: schema.teams.name,
      points: schema.teams.pointsTotal,
    })
    .from(schema.teams)
    .orderBy(desc(schema.teams.pointsTotal))
    .limit(limit);
});
