<script setup lang="ts">
const { data: announcements } = await useFetch("/api/announcements?limit=50");

const columns = [{ accessorKey: "title", header: "标题" }];
</script>

<template>
  <UPageHeader title="公告" description="查看所有公告" />

  <UTable :data="announcements" :columns="columns" empty="暂无公告" />
</template>
