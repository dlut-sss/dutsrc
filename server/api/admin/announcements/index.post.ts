import { z } from "zod";
import { db, schema } from "@nuxthub/db";

const bodySchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  pinned: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readBody(event);
  const { title, content, pinned } = bodySchema.parse(body);

  return await db
    .insert(schema.announcements)
    .values({
      title,
      content,
      pinned: pinned ?? false,
      authorId: user.id,
    })
    .returning();
});
