<script setup lang="ts">
const { site } = useAppConfig();

const navItems = computed(() => {
  return [
    {
      label: "关于",
      to: "/about",
    },
  ];
});
</script>

<template>
  <UHeader :title="site.title">
    <UNavigationMenu :items="navItems" />
  </UHeader>
  <UMain>
    <slot />
  </UMain>
  <UFooter />
</template>
