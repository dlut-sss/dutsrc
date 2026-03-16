<script setup lang="ts">
import { z } from "zod";

const { data: profile, refresh } = await useFetch("/api/profile");

const schema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.email("邮箱格式不正确"),
  role: z.string(),
  pointsTotal: z.number(),
  pointsBalance: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
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

const toast = useToast();

function submit() {
  $fetch("/api/profile", {
    method: "PUT",
    body: {
      name: state.name,
      email: state.email,
    },
  })
    .then(async () => {
      await refresh();
      toast.add({
        title: "保存成功",
        description: "您的个人资料已更新",
        color: "primary",
      });
    })
    .catch((error: any) => {
      toast.add({
        title: "保存失败",
        description: error.data?.message || error.message || "未知错误",
        color: "error",
      });
    });
}
</script>

<template>
  <UPage>
    <UPageHeader title="个人资料" description="查看和编辑您的个人资料" />
    <UPageBody>
      <UForm
        class="flex flex-col gap-2"
        :schema="schema"
        :state="state"
        @submit="submit"
      >
        <UFormField name="name" label="姓名" required>
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField name="email" label="邮箱" required>
          <UInput v-model="state.email" type="email" class="w-full" />
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
          <UButton type="submit">保存</UButton>
        </div>
      </UForm>
    </UPageBody>
  </UPage>
</template>
