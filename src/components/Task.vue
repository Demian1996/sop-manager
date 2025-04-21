<template>
  <div 
    class="ghibli-task" 
    :class="{ completed: task.completed }" 
    @click="handleTaskClick"
  >
    <div class="task-content">
      <div class="task-info" :title="task.description || task.name">
        <span class="task-name">{{ task.name }}</span>
        <p v-if="task.description" class="task-description">{{ task.description }}</p>
      </div>
      <div class="task-actions" @click.stop>
        <label v-if="showCheckbox" class="ghibli-checkbox">
          <input 
            type="checkbox"
            :checked="task.completed"
            @change="handleCheckboxChange"
          />
          <span class="checkbox-custom">
            <i class="fas fa-check"></i>
          </span>
        </label>
        <GhibliButton 
          v-if="showEdit" 
          type="outline"
          size="small"
          class="action-btn" 
          @click="$emit('edit', task)"
        >
          <template #icon>
            <i class="fas fa-edit"></i>
          </template>
        </GhibliButton>
        <GhibliButton 
          v-if="showDelete" 
          type="danger"
          size="small"
          class="action-btn" 
          @click="$emit('delete', task)"
        >
          <template #icon>
            <i class="fas fa-trash-alt"></i>
          </template>
        </GhibliButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/sop';
import { GhibliButton } from '@/components';

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

const handleCheckboxChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  target.checked ? emit('complete', props.task) : emit('cancel', props.task);
};

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
.ghibli-task {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #8b9f78;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 2px 2px 0 #8b9f78;
  overflow: hidden;
}

.ghibli-task:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #8b9f78;
  background: #fff;
}

.task-content {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-name {
  font-size: 14px;
  color: #5c4b51;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'ZCOOL XiaoWei', serif;
}

.task-description {
  font-size: 12px;
  color: #8b9f78;
  margin: 4px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  font-family: 'ZCOOL XiaoWei', serif;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: default;
}

.ghibli-checkbox {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.ghibli-checkbox input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.checkbox-custom {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: #fdfbec;
  border: 2px solid #8b9f78;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-custom i {
  color: #8b9f78;
  font-size: 12px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease;
}

.ghibli-checkbox input:checked + .checkbox-custom {
  background: #8b9f78;
}

.ghibli-checkbox input:checked + .checkbox-custom i {
  opacity: 1;
  transform: scale(1);
  color: #fff;
}

.ghibli-checkbox:hover .checkbox-custom {
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0 #8b9f78;
}

.action-btn {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.action-btn:hover {
  opacity: 1;
}

.ghibli-task.completed {
  opacity: 0.8;
  border-style: dashed;
}

.ghibli-task.completed .task-name {
  text-decoration: line-through;
  color: #8b9f78;
}

.ghibli-task.completed .task-description {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .task-content {
    padding: 10px 12px;
  }

  .task-name {
    font-size: 13px;
  }

  .task-description {
    font-size: 11px;
  }
}
</style>
