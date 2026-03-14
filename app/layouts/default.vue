<script setup lang="ts">
import { computed } from "vue";

const { site } = useAppConfig();

const navItems = computed(() => [
  { label: "首页", to: "/" },
  { label: "用户", to: "/users" },
  { label: "团队", to: "/teams" },
  { label: "漏洞", to: "/vulnerabilities" },
  { label: "排行榜", to: "/leaderboard" },
]);

const userMenuItems = computed(() => [
  { label: "个人资料", to: "/profile" },
  { label: "登出", onClick: () => console.log("登出（占位）") },
]);

const currentYear = new Date().getFullYear();
</script>

<template>
  <UHeader :title="site.title" :description="site.description">
    <UNavigationMenu class="hidden md:block" :items="navItems" />
    <template #right>
      <UDropdownMenu :items="userMenuItems" placement="bottom-end">
        <template #default="{ open }">
          <UButton
            label="访客"
            icon="i-lucide-user"
            variant="ghost"
            :trailing-icon="
              open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
            "
          />
        </template>
      </UDropdownMenu>
    </template>
    <template #content>
      <div class="px-4">
        <UNavigationMenu orientation="vertical" :items="navItems" />
        <div class="mt-6">
          <UDropdownMenu :items="userMenuItems" placement="bottom-start">
            <template #default="{ open }">
              <UButton
                variant="ghost"
                class="w-full justify-between"
                icon="i-lucide-user"
                :trailing-icon="
                  open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
                "
              >
                访客
              </UButton>
            </template>
          </UDropdownMenu>
        </div>
      </div>
    </template>
  </UHeader>

  <UMain class="min-h-[calc(100vh-14rem)]">
    <UContainer class="py-8">
      <slot />
    </UContainer>
  </UMain>

  <UFooter>
    <template #left>
      <div class="text-sm text-muted">
        © {{ currentYear }} {{ site.title }}.
      </div>
    </template>
    <template #right>
      <UNavigationMenu variant="link" :items="navItems" />
    </template>
  </UFooter>
</template>
