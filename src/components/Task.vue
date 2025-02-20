<template>
  <div class="task" :class="{ completed: task.completed }">
    <div class="task-content">
      <a-tooltip 
        v-if="task.description"
        :title="task.description"
        placement="topLeft"
      >
        <span class="task-name" :title="task.name">{{ task.name }}</span>
      </a-tooltip>
      <span v-else class="task-name" :title="task.name">{{ task.name }}</span>
      <div class="task-actions">
        <a-checkbox 
          v-if="showCheckbox" 
          :checked="task.completed" 
          @change="(e) => $emit('complete', task, e.target.checked)"
        />
        <a-button
          v-if="showDelete" 
          type="text"
          class="action-btn"
          @click="$emit('edit', task)"
        >
          <template #icon><edit-outlined /></template>
        </a-button>
        <a-button 
          v-if="showDelete" 
          type="text" 
          danger 
          class="action-btn" 
          @click="$emit('delete', task)"
        >
          <template #icon><delete-outlined /></template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Checkbox as ACheckbox, Tooltip as ATooltip } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { Task } from '@/types/sop';

defineProps<{
  task: Task;
  showCheckbox: boolean;
  showDelete: boolean;
}>();

defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'complete', task: Task, checked: boolean): void;
  (e: 'delete', task: Task): void;
}>();
</script>

<style scoped>
.task {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.task-content {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-name {
  font-size: 14px;
  color: #2c3e50;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  padding: 0;
  height: auto;
}

.task.completed {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.task.completed .task-name {
  text-decoration: line-through;
  color: #999;
}
</style>
