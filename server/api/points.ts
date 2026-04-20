import { db, schema } from "@nuxthub/db";
import { desc, eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const query = getQuery(event);
  const page = Math.max(Number(query.page ?? 1), 1);
  const limit = Math.max(Number(query.limit ?? 20), 1);
  const offset = (page - 1) * limit;

  const items = await db.query.pointTransactions.findMany({
    where: (pointTransactions, { eq }) => eq(pointTransactions.userId, user.id),
    orderBy: (pointTransactions, { desc }) => [desc(pointTransactions.createdAt)],
    limit,
    offset,
  });

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.pointTransactions)
    .where(eq(schema.pointTransactions.userId, user.id));

  return {
    items,
    page,
    limit,
    total: Number(count),
  };
});