<template>
  <div class="ghibli-node">
    <div class="node-content">
      <div class="node-header">
        <i v-if="isEditMode" class="fas fa-grip-vertical drag-handle"></i>
        <input 
          v-if="isEditMode" 
          v-model="node.name" 
          placeholder="节点名称" 
          class="node-title-input"
        />
        <h3 v-else class="node-title">{{ node.name }}</h3>
        <GhibliButton 
          v-if="isEditMode"
          type="danger"
          size="small"
          class="delete-btn"
          @click="onDeleteNode"
        >
          <template #icon>
            <i class="fas fa-trash-alt"></i>
          </template>
        </GhibliButton>
      </div>
      <div class="tasks">
        <template v-for="task in node.tasks" :key="task.id">
          <TaskEditor v-if="editingTask && editingTask.id === task.id" :task="editingTask" @save="onSaveTask" />
          <Task
            v-else
            :task="task"
            :show-checkbox="!isEditMode"
            :show-delete="isEditMode"
            :show-edit="isEditMode"
            @delete="onDeleteTask"
            @complete="onCompleteTask"
            @cancel="onCancelTask"
            @edit="onEditTask"
          />
        </template>
        <button v-if="isEditMode" class="add-task-btn" @click="onCreateTask">
          <span class="button-content">
            <i class="fas fa-plus"></i>
            添加任务
          </span>
          <div class="button-glow"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimelineNode as ITimelineNode, Task as ITask, Timeline } from '@/types/sop';
import Task from './Task.vue';
import TaskEditor from './TaskEditor.vue';
import { ref } from 'vue';
import { useTimelineStore } from '@/stores/timeline';
import { GhibliButton } from '@/components';

const props = defineProps<{
  timeline: Timeline;
  node: ITimelineNode;
  index: number;
  isEditMode: boolean;
}>();

const store = useTimelineStore();
const editingTask = ref<ITask | null>(null);

const onDeleteNode = () => {
  store.deleteNode(props.timeline, props.index);
};

const onCreateTask = () => {
  editingTask.value = store.createEmptyTask();
  store.addTask(props.node, editingTask.value as ITask);
};

const onDeleteTask = (task: ITask) => {
  store.deleteTask(props.node, task);
};

const onSaveTask = (task: ITask) => {
  store.updateTask(props.node, task);
  editingTask.value = null;
};

const onCompleteTask = (task: ITask) => {
  store.completeTask(task);
};

const onCancelTask = (task: ITask) => {
  store.cancelTask(task);
};

const onEditTask = (task: ITask) => {
  editingTask.value = task;
};
</script>

<style scoped>
.ghibli-node {
  width: 300px;
  flex-shrink: 0;
  position: relative;
  background: #fdfbec;
  border: 2px solid #8b9f78;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #8b9f78;
  transition: all 0.3s ease;
  overflow: hidden;
}

.ghibli-node:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #8b9f78;
}

.node-content {
  padding: 16px;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(139, 159, 120, 0.2);
  margin-bottom: 16px;
}

.drag-handle {
  cursor: move;
  color: #8b9f78;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.drag-handle:hover {
  opacity: 1;
}

.node-title {
  margin: 0;
  flex-grow: 1;
  font-size: 18px;
  color: #5c4b51;
  font-family: 'ZCOOL XiaoWei', serif;
}

.node-title-input {
  flex-grow: 1;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  font-size: 18px;
  color: #5c4b51;
  font-family: 'ZCOOL XiaoWei', serif;
  padding: 4px 0;
  transition: all 0.3s ease;
}

.node-title-input:hover,
.node-title-input:focus {
  outline: none;
  border-bottom-color: #8b9f78;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.delete-btn {
  margin-left: auto;
}

.add-task-btn {
  position: relative;
  width: 100%;
  padding: 8px 16px;
  border: 2px dashed #8b9f78;
  border-radius: 8px;
  background: transparent;
  color: #8b9f78;
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: 8px;
  font-family: 'ZCOOL XiaoWei', serif;
}

.add-task-btn:hover {
  background: rgba(139, 159, 120, 0.1);
  border-style: solid;
}

.add-task-btn .button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-task-btn .button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(139, 159, 120, 0.2) 0%, rgba(139, 159, 120, 0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.add-task-btn:hover .button-glow {
  opacity: 1;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .ghibli-node {
    width: 280px;
  }

  .node-title,
  .node-title-input {
    font-size: 16px;
  }

  .add-task-btn {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>
