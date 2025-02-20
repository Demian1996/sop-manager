<template>
  <div class="header">
    <div class="title-bar">
      <div class="left-section">
        <a-button @click="$emit('back')">
          <template #icon><arrow-left-outlined /></template>
          返回
        </a-button>
        <a-input
          v-if="isEditMode"
          :value="title"
          placeholder="输入时间轴名称"
          class="timeline-title-input"
          @update:value="$emit('updateTitle', $event)"
        />
        <h1 v-else class="timeline-title">{{ title }}</h1>
      </div>
      <div class="action-buttons">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

defineProps<{
  isEditMode: boolean
  title: string
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'updateTitle', value: string): void
}>()
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timeline-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.timeline-title-input {
  font-size: 20px;
  font-weight: 600;
  width: 300px;
  border: none;
  border-bottom: 2px solid #e8e8e8;
  padding: 4px 0;
}

.timeline-title-input:hover,
.timeline-title-input:focus {
  border-bottom-color: #1890ff;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style> 