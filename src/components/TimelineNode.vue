<template>
  <!-- 时间轴节点 -->
  <a-card class="node" :bordered="true">
    <template #title>
      <div class="node-header">
        <MenuOutlined v-if="isEditMode" class="drag-handle" />
        <a-input v-if="isEditMode" v-model:value="node.name" placeholder="节点名称" :bordered="false" />
        <span v-else>{{ node.name }}</span>
      </div>
    </template>
    <template #extra v-if="isEditMode">
      <a-button type="text" danger @click="onDeleteNode" class="delete-btn">
        <template #icon><delete-outlined /></template>
      </a-button>
    </template>
    <div class="tasks">
      <template v-for="task in node.tasks" :key="task.id">
        <TaskEditor v-if="editingTask && editingTask.id === task.id" :task="editingTask" @save="onSaveTask" />
        <Task
          v-else
          :task="task"
          :show-checkbox="!isEditMode"
          :show-delete="isEditMode"
          @delete="onDeleteTask"
          @complete="onCompleteTask"
          @cancel="onCancelTask"
        />
      </template>
      <a-button v-if="isEditMode" type="dashed" block @click="onCreateTask" class="add-task-btn">
        <template #icon><plus-outlined /></template>
        添加任务
      </a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { MenuOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { TimelineNode as ITimelineNode, Task as ITask, Timeline } from '@/types/sop';
import Task from './Task.vue';
import TaskEditor from './TaskEditor.vue';
import { ref } from 'vue';
import { useTimelineStore } from '@/stores/timeline';

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
</script>

<style scoped>
.node {
  width: 300px;
  flex-shrink: 0;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-handle {
  cursor: move;
  color: #999;
}

.tasks {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-task-btn {
  margin-top: 16px;
}

.delete-btn {
  margin-top: 4px;
  padding: 0;
  height: auto;
}
</style>
