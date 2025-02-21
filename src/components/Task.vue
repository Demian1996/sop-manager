<template>
  <div 
    class="task" 
    :class="{ completed: task.completed }" 
    @click="handleTaskClick"
  >
    <div class="task-content">
      <a-tooltip v-if="task.description" :title="task.description" placement="topLeft">
        <span class="task-name" :title="task.name">{{ task.name }}</span>
      </a-tooltip>
      <span v-else class="task-name" :title="task.name">{{ task.name }}</span>
      <div class="task-actions" @click.stop>
        <a-checkbox
          v-if="showCheckbox"
          :checked="task.completed"
          @change="(e) => (e.target.checked ? $emit('complete', task) : $emit('cancel', task))"
        />
        <a-button v-if="showEdit" type="text" class="action-btn" @click="$emit('edit', task)">
          <template #icon><edit-outlined /></template>
        </a-button>
        <a-button v-if="showDelete" type="text" danger class="action-btn" @click="$emit('delete', task)">
          <template #icon><delete-outlined /></template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Checkbox as ACheckbox, Tooltip as ATooltip, Button as AButton } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { Task } from '@/types/sop';

const props = defineProps<{
  task: Task;
  showCheckbox: boolean;
  showEdit: boolean;
  showDelete: boolean;
}>();

const emit = defineEmits<{
  (e: 'complete', task: Task): void;
  (e: 'cancel', task: Task): void;
  (e: 'delete', task: Task): void;
  (e: 'edit', task: Task): void;
}>();

const handleTaskClick = () => {
  if (!props.showCheckbox) return;
  if (props.task.completed) {
    emit('cancel', props.task);
  } else {
    emit('complete', props.task);
  }
};
</script>

<style scoped>
.task {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task:hover {
  background: #fafafa;
  border-color: #e8e8e8;
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
  cursor: default;
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
