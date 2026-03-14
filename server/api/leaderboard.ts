import { db, schema } from "@nuxthub/db";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 10);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  const users = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      points: schema.users.pointsTotal,
    })
    .from(schema.users)
    .orderBy(desc(schema.users.pointsTotal))
    .limit(limit)
    .offset(offset);

  const teams = await db
    .select({
      id: schema.teams.id,
      name: schema.teams.name,
      points: schema.teams.pointsTotal,
    })
    .from(schema.teams)
    .orderBy(desc(schema.teams.pointsTotal))
    .limit(limit)
    .offset(offset);

  return { users, teams };
});
