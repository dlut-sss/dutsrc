import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { vulnerabilitySeverityEnum } from "../../../shared/types/db";

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

  const body = await readBody(event);
  const { title, type, severity, unit, vendor, points, description, advisory } =
    bodySchema.parse(body);

  const [vulnerability] = await db
    .insert(schema.vulnerabilities)
    .values({
      title,
      type,
      severity,
      unit,
      vendor,
      points: points ?? 0,
      description,
      advisory,
      authorId: user.id,
    })
    .returning();

  return vulnerability;
});
