<template>
  <div class="header-actions">
    <a-upload accept=".json" :show-upload-list="false" :before-upload="handleImport">
      <a-button>
        <template #icon><DownloadOutlined /></template>
        导入
      </a-button>
    </a-upload>
    <a-button @click="$emit('export')">
      <template #icon><UploadOutlined /></template>
      导出
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons-vue';

const emit = defineEmits<{
  (e: 'import', file: File): void;
  (e: 'export'): void;
}>();

const handleImport = (file: File) => {
  emit('import', file);
  return false;
};
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 12px;
}
</style>
