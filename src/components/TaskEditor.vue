<template>
  <div class="task-content editing">
    <a-form layout="vertical" class="task-form">
      <a-form-item>
        <a-input
          v-model:value="taskData.name"
          placeholder="任务名称"
          class="task-input"
          :bordered="false"
          size="large"
        />
      </a-form-item>
      <a-form-item>
        <a-textarea
          v-model:value="taskData.description"
          placeholder="任务描述"
          :rows="3"
          class="task-textarea"
          :bordered="false"
        />
      </a-form-item>
    </a-form>
    <div class="task-edit-actions">
      <a-button type="primary" size="small" @click="$emit('save', taskData)">保存</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '@/types/sop';

const props = defineProps<{
  task: Task;
}>();

const taskData = ref(props.task);

defineEmits<{
  (e: 'save', data: typeof taskData.value): void;
}>();
</script>

<style scoped>
.task-content.editing {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.task-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.task-form {
  margin-bottom: 0;
}

.task-input {
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.task-input:hover,
.task-input:focus {
  border-bottom-color: #1890ff;
}

.task-textarea {
  font-size: 14px;
  line-height: 1.6;
  padding: 8px 0;
  background: #fafafa;
  border-radius: 4px;
}
</style>
