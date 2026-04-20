<script setup lang="ts">
const page = ref(1);
const limit = 20;

const { data, pending } = await useFetch("/api/points", {
  query: computed(() => ({
    page: page.value,
    limit,
  })),
});

const items = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);

const columns = [
  { accessorKey: "points", header: "积分变动" },
  { accessorKey: "reason", header: "原因" },
  { accessorKey: "createdAt", header: "时间" },
];

const totalPages = computed(() => {
  const value = Math.ceil(total.value / limit);
  return value > 0 ? value : 1;
});
</script>

<template>
  <UPage>
    <UPageHeader title="我的积分" description="查看积分历史记录" />
    <UPageBody>
      <UTable :loading="pending" :data="items" :columns="columns" empty="暂无积分记录">
        <template #points-cell="{ getValue }">
          <UBadge :color="getValue() >= 0 ? 'success' : 'error'" variant="subtle">
            {{ getValue() >= 0 ? `+${getValue()}` : getValue() }}
          </UBadge>
        </template>

        <template #reason-cell="{ getValue }">
          {{ getValue() || "-" }}
        </template>

        <template #createdAt-cell="{ row }">
          {{ new Date(row.original.createdAt).toLocaleString() }}
        </template>
      </UTable>

      <div class="mt-4 flex justify-end" v-if="total > limit">
        <UPagination v-model:page="page" :items-per-page="limit" :total="total" />
      </div>
    </UPageBody>
  </UPage>
</template>