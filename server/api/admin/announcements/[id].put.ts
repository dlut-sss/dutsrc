import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

const bodySchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  pinned: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  const body = await readBody(event);
  const { title, content, pinned } = bodySchema.parse(body);

  return await db
    .update(schema.announcements)
    .set({
      title,
      content,
      pinned: pinned ?? false,
    })
    .where(eq(schema.announcements.id, id));
});
