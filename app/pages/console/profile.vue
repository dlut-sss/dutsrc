<script setup lang="ts">
import { z } from "zod";

const { data: profile, refresh } = await useFetch("/api/profile");

const profileSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.email("邮箱格式不正确"),
  role: z.string(),
  pointsTotal: z.number(),
  pointsBalance: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z.string().min(1, "请输入新密码"),
    confirmPassword: z.string().min(1, "请确认新密码"),
  })
  .superRefine((value, context) => {
    if (value.newPassword !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "两次输入的密码不一致",
      });
    }
  });

const state = reactive({
  name: profile.value?.name || "",
  email: profile.value?.email || "",
  role: profile.value?.role || "",
  pointsTotal: profile.value?.pointsTotal || 0,
  pointsBalance: profile.value?.pointsBalance || 0,
  createdAt: profile.value?.createdAt || "",
  updatedAt: profile.value?.updatedAt || "",
});

const passwordState = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordModalOpen = ref(false);
const passwordFormKey = ref(0);

function resetPasswordForm() {
  passwordState.currentPassword = "";
  passwordState.newPassword = "";
  passwordState.confirmPassword = "";
  passwordFormKey.value += 1;
}

function openPasswordModal() {
  resetPasswordForm();
  passwordModalOpen.value = true;
}

function closePasswordModal() {
  passwordModalOpen.value = false;
  resetPasswordForm();
}

const toast = useToast();

async function submit() {
  try {
    await $fetch("/api/profile", {
      method: "PUT",
      body: {
        name: state.name,
      },
    });

    await refresh();
    toast.add({
      title: "保存成功",
      description: "您的个人资料已更新",
      color: "primary",
    });
  } catch (error: any) {
    toast.add({
      title: "保存失败",
      description: error.data?.message || error.message || "未知错误",
      color: "error",
    });
  }
}

async function submitPassword() {
  try {
    await $fetch("/api/profile", {
      method: "PUT",
      body: {
        name: state.name,
        currentPassword: passwordState.currentPassword,
        newPassword: passwordState.newPassword,
        confirmPassword: passwordState.confirmPassword,
      },
    });

    await refresh();
    closePasswordModal();
    toast.add({
      title: "密码已更新",
      description: "您的登录密码已成功修改",
      color: "primary",
    });
  } catch (error: any) {
    toast.add({
      title: "密码修改失败",
      description: error.data?.message || error.message || "未知错误",
      color: "error",
    });
  }
}
</script>

<template>
  <UPage>
    <UPageHeader title="个人资料" description="查看和编辑您的个人资料" />
    <UPageBody>
      <UForm
        class="flex flex-col gap-2"
        :schema="profileSchema"
        :state="state"
        @submit="submit"
      >
        <UFormField name="name" label="姓名" required>
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField name="email" label="邮箱" required>
          <UInput v-model="state.email" type="email" readonly class="w-full" />
        </UFormField>

        <UFormField name="role" label="角色">
          <UInput v-model="state.role" readonly class="w-full" />
        </UFormField>

        <UFormField name="pointsTotal" label="总积分">
          <UInput v-model="state.pointsTotal" readonly class="w-full" />
        </UFormField>

        <UFormField name="pointsBalance" label="可用积分">
          <UInput v-model="state.pointsBalance" readonly class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-2 mt-4">
          <UButton
            color="neutral"
            variant="soft"
            type="button"
            @click="openPasswordModal"
          >
            修改密码
          </UButton>
          <UButton type="submit">保存</UButton>
        </div>
      </UForm>

      <UModal
        v-model:open="passwordModalOpen"
        title="修改密码"
        description="输入当前密码和新密码完成修改"
      >
        <template #body>
          <UPageCard class="w-full max-w-lg" variant="naked">
            <UForm
              :key="passwordFormKey"
              class="flex flex-col gap-4"
              :schema="passwordSchema"
              :state="passwordState"
              @submit="submitPassword"
            >
              <UFormField name="currentPassword" label="当前密码" required>
                <UInput
                  v-model="passwordState.currentPassword"
                  type="password"
                  autocomplete="current-password"
                  class="w-full"
                />
              </UFormField>

              <UFormField name="newPassword" label="新密码" required>
                <UInput
                  v-model="passwordState.newPassword"
                  type="password"
                  autocomplete="new-password"
                  class="w-full"
                />
              </UFormField>

              <UFormField name="confirmPassword" label="确认新密码" required>
                <UInput
                  v-model="passwordState.confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  class="w-full"
                />
              </UFormField>

              <div class="flex justify-end gap-2 pt-2">
                <UButton
                  color="neutral"
                  variant="ghost"
                  type="button"
                  @click="closePasswordModal"
                >
                  取消
                </UButton>
                <UButton type="submit">确认修改</UButton>
              </div>
            </UForm>
          </UPageCard>
        </template>
      </UModal>
    </UPageBody>
  </UPage>
</template>
