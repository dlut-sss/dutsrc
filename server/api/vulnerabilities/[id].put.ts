import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

const bodySchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  type: z.string().min(1, "类型不能为空"),
  severity: z.enum(vulnerabilitySeverityEnum, { message: "请选择严重性" }),
  unit: z.string().optional(),
  vendor: z.string().optional(),
  points: z.number().min(0).optional(),
  description: z.string().min(1, "描述不能为空"),
  advisory: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  // Check if the vulnerability belongs to the user
  const [existing] = await db
    .select()
    .from(schema.vulnerabilities)
    .where(eq(schema.vulnerabilities.id, id));

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Vulnerability not found",
    });
  }

  if (existing.authorId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody(event);
  const { title, type, severity, unit, vendor, points, description, advisory } =
    bodySchema.parse(body);

  const [vulnerability] = await db
    .update(schema.vulnerabilities)
    .set({
      title,
      type,
      severity,
      unit,
      vendor,
      points: points ?? 0,
      description,
      advisory,
      updatedAt: new Date(),
    })
    .where(eq(schema.vulnerabilities.id, id))
    .returning();

  return vulnerability;
});
