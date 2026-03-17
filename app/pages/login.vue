<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const { site } = useAppConfig();
const { fetch } = useUserSession();
const toast = useToast();
const {
  public: { casBaseUrl, casServiceUrl },
} = useRuntimeConfig();

const providers = computed(() => [
  {
    label: "通过统一身份认证登录",
    icon: "i-lucide-shield-check",
    to: `${casBaseUrl}/login?service=${casServiceUrl}`,
  },
]);

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "邮箱",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "密码",
    required: true,
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required"),
});

function login(payload: FormSubmitEvent<z.output<typeof schema>>) {
  $fetch("/api/auth/login", {
    method: "POST",
    body: payload.data,
  })
    .then(async () => {
      await fetch();
      navigateTo("/");
    })
    .catch((err) => {
      toast.add({
        title: "登录失败",
        color: "error",
        description: err.data?.message || err.message,
      });
    });
}
</script>

<template>
  <UPage>
    <UPageBody>
      <div class="max-w-md mx-auto flex flex-col gap-4">
        <UAuthForm
          :title="`登录到 ${site.title}`"
          :providers="providers"
          :fields="fields"
          :schema="schema"
          @submit="login"
        />
      </div>
    </UPageBody>
  </UPage>
</template>
