<script setup lang="ts">
import { z } from "zod";

const { data, refresh } = await useFetch("/api/admin/announcements?limit=100");
const announcements = computed(() => data.value ?? []);

const columns = [
  { accessorKey: "title", header: "标题" },
  { accessorKey: "createdAt", header: "创建时间" },
  { accessorKey: "actions", header: "操作" },
];

const openDrawer = ref(false);
const editingId = ref<number | null>(null);

const schema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  pinned: z.boolean().optional(),
});

type AnnouncementForm = z.output<typeof schema>;
const state = reactive<AnnouncementForm>({
  title: "",
  content: "",
  pinned: false,
});

function openNewDrawer() {
  editingId.value = null;
  Object.assign(state, { title: "", content: "", pinned: false });
  openDrawer.value = true;
}

function openEditDrawer(item: any) {
  editingId.value = item.id;
  Object.assign(state, {
    title: item.title,
    content: item.content,
    pinned: !!item.pinned,
  });
  openDrawer.value = true;
}

async function submit() {
  if (editingId.value) {
    await $fetch(`/api/admin/announcements/${editingId.value}`, {
      method: "PUT",
      body: state,
    });
  } else {
    await $fetch("/api/admin/announcements", {
      method: "POST",
      body: state,
    });
  }
  await refresh();
  openDrawer.value = false;
}

function closeDrawer() {
  openDrawer.value = false;
}
</script>

<template>
  <UPageHeader title="公告管理">
    <template #links>
      <UButton color="neutral" variant="outline" @click="openNewDrawer"
        >新建公告</UButton
      >
    </template>
  </UPageHeader>

  <UPageBody>
    <UTable :data="announcements" :columns="columns" empty="暂无公告">
      <template #title-cell="{ row }">
        {{ row.original.title }}
        <UBadge v-if="row.original.pinned" color="primary" variant="subtle"
          >置顶</UBadge
        >
      </template>
      <template #createdAt-cell="{ row }">
        {{ new Date(row.original.createdAt).toLocaleString() }}
      </template>
      <template #actions-cell="{ row }">
        <UButton
          size="xs"
          icon="i-lucide-edit"
          variant="ghost"
          @click="openEditDrawer(row.original)"
        />
      </template>
    </UTable>
  </UPageBody>

  <UDrawer
    v-model:open="openDrawer"
    direction="right"
    class="w-md"
    :handle="false"
    handle-only
    :title="editingId ? '编辑公告' : '新建公告'"
  >
    <template #body>
      <UForm
        class="flex flex-col gap-2"
        :schema="schema"
        :state="state"
        @submit="submit"
      >
        <UFormField name="title" label="标题" required>
          <UInput
            class="w-full"
            v-model="state.title"
            placeholder="请输入公告标题"
          />
        </UFormField>

        <UFormField name="content" label="内容" required>
          <UTextarea
            class="w-full"
            v-model="state.content"
            placeholder="请输入公告内容"
          />
        </UFormField>

        <UCheckbox v-model="state.pinned" label="置顶" />

        <div class="flex justify-end gap-2">
          <UButton type="button" variant="ghost" @click="closeDrawer"
            >取消</UButton
          >
          <UButton type="submit">{{ editingId ? "保存" : "创建" }}</UButton>
        </div>
      </UForm>
    </template>
  </UDrawer>
</template>
