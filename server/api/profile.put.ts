import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

const bodySchema = z
  .object({
    name: z.string().min(1, "姓名不能为空"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((value, context) => {
    const isChangingPassword = Boolean(
      value.currentPassword || value.newPassword || value.confirmPassword,
    );

    if (!isChangingPassword) {
      return;
    }

    if (!value.currentPassword) {
      context.addIssue({
        code: "custom",
        path: ["currentPassword"],
        message: "请输入当前密码",
      });
    }

    if (!value.newPassword) {
      context.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "请输入新密码",
      });
    }

    if (!value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "请确认新密码",
      });
    }

    if (
      value.newPassword &&
      value.confirmPassword &&
      value.newPassword !== value.confirmPassword
    ) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "两次输入的密码不一致",
      });
    }
  });

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readBody(event);
  const { name, currentPassword, newPassword } = bodySchema.parse(body);

  const updateData: {
    name: string;
    updatedAt: Date;
    password?: string;
  } = {
    name,
    updatedAt: new Date(),
  };

  if (newPassword) {
    const account = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, user.id),
      columns: {
        password: true,
      },
    });

    if (
      !account?.password ||
      !currentPassword ||
      !(await verifyPassword(account.password, currentPassword))
    ) {
      throw createError({
        statusCode: 400,
        message: "当前密码不正确",
      });
    }

    updateData.password = await hashPassword(newPassword);
  }

  await db
    .update(schema.users)
    .set(updateData)
    .where(eq(schema.users.id, user.id));

  return { success: true };
});
