<script setup lang="ts">
const { site } = useAppConfig();

useHead({
  titleTemplate: (title?: string) =>
    title ? `${title} | ${site.title}` : site.title,
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";
</style>
