import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  const [announcement] = await db
    .select({
      id: schema.announcements.id,
      title: schema.announcements.title,
      content: schema.announcements.content,
      pinned: schema.announcements.pinned,
      createdAt: schema.announcements.createdAt,
      authorId: schema.announcements.authorId,
    })
    .from(schema.announcements)
    .where(eq(schema.announcements.id, id));

  if (!announcement) {
    throw createError({ statusCode: 404, statusMessage: "Announcement not found" });
  }

  return announcement;
});
