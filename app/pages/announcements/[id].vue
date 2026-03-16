<script setup lang="ts">
const route = useRoute();
const id = Number(route.params.id);

const { data: announcement } = await useFetch(`/api/announcements/${id}`);
</script>

<template>
  <UPage v-if="announcement">
    <UPageHeader
      :title="announcement.title"
      :description="`发布于 ${new Date(announcement.createdAt).toLocaleDateString('zh-CN')}`"
    >
      <template #links v-if="announcement.pinned">
        <UBadge color="primary" variant="subtle">置顶</UBadge>
      </template>
    </UPageHeader>
    <UPageBody>
      <MDC :value="announcement.content" />
    </UPageBody>
  </UPage>
  <UPage v-else>
    <UPageBody>
      <UEmpty description="公告不存在" />
    </UPageBody>
  </UPage>
</template>
