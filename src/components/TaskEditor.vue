<template>
  <div class="ghibli-task-editor">
    <div class="editor-content">
      <div class="input-group">
        <input
          v-model="taskData.name"
          placeholder="任务名称"
          class="ghibli-input task-name-input"
        />
        <textarea
          v-model="taskData.description"
          placeholder="任务描述"
          rows="3"
          class="ghibli-input task-description-input"
        ></textarea>
      </div>
      <div class="editor-actions">
        <GhibliButton type="primary" size="small" @click="$emit('save', taskData)">
          <template #icon>
            <i class="fas fa-check"></i>
          </template>
          保存
        </GhibliButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '@/types/sop';
import { GhibliButton } from '@/components';

const props = defineProps<{
  task: Task;
}>();

const taskData = ref(props.task);

defineEmits<{
  (e: 'save', data: typeof taskData.value): void;
}>();
</script>

<style scoped>
.ghibli-task-editor {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #8b9f78;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #8b9f78;
  overflow: hidden;
  transition: all 0.3s ease;
}

.ghibli-task-editor:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #8b9f78;
}

.editor-content {
  padding: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ghibli-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid rgba(139, 159, 120, 0.2);
  background: transparent;
  font-family: 'ZCOOL XiaoWei', serif;
  color: #5c4b51;
  transition: all 0.3s ease;
  padding: 8px 0;
  resize: none;
}

.ghibli-input:hover,
.ghibli-input:focus {
  outline: none;
  border-bottom-color: #8b9f78;
}

.task-name-input {
  font-size: 16px;
  font-weight: 500;
}

.task-description-input {
  font-size: 14px;
  line-height: 1.6;
  min-height: 80px;
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(139, 159, 120, 0.2);
}

@media (max-width: 768px) {
  .editor-content {
    padding: 12px;
  }

  .task-name-input {
    font-size: 15px;
  }

  .task-description-input {
    font-size: 13px;
    min-height: 60px;
  }
}
</style>
