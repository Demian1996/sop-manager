<template>
  <div class="editor">
    <EditorHeader
      :editable="true"
      :title="currentTimeline.name"
      @back="goBack"
      @update:title="(value) => (currentTimeline.name = value)"
    >
      <template #actions>
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="saveTimeline">保存</a-button>
      </template>
    </EditorHeader>

    <div class="timeline-nodes">
      <a-button v-if="isEditMode" type="primary" shape="circle" class="add-node-btn left" @click="addNodeBefore(0)">
        <template #icon><plus-outlined /></template>
      </a-button>

      <Draggable
        v-model="currentTimeline.nodes"
        :disabled="!isEditMode"
        item-key="id"
        class="nodes-container"
        handle=".drag-handle"
      >
        <template #item="{ element: node, index }">
          <TimelineNode
            v-if="isEditMode || node.name.trim()"
            :node="node"
            :editable="isEditMode"
            :temp-task="tempTask"
            @delete="deleteNode(index)"
            @add-task="addTask(index)"
            @edit-task="startTaskEditing(node, $event)"
            @delete-task="deleteTask(node, $event)"
            @complete-task="handleTaskComplete(node)"
          />
        </template>
      </Draggable>

      <a-button
        v-if="isEditMode"
        type="primary"
        shape="circle"
        class="add-node-btn right"
        @click="addNodeAfter(currentTimeline.nodes.length - 1)"
      >
        <template #icon><plus-outlined /></template>
      </a-button>
    </div>

    <TaskEditor
      v-if="editingTask"
      :initial-data="editingTask.editCache"
      :position="editingTask.position"
      @save="saveEditing"
      @cancel="cancelTaskEditing"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTimelineStore } from '@/stores/timeline';
import { useRoute, useRouter } from 'vue-router';
import type { Timeline, TimelineNode as ITimelineNode, Task } from '@/types/sop';
import Draggable from 'vuedraggable';
import {
  PlusOutlined,
  DeleteOutlined,
  MenuOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  TrophyOutlined,
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import EditorHeader from '@/components/timeline/EditorHeader.vue';
import TimelineNode from '@/components/timeline/TimelineNode.vue';
import TaskEditor from '@/components/timeline/TaskEditor.vue';

const store = useTimelineStore();
const route = useRoute();
const router = useRouter();

// 判断当前是创建态还是编辑态
const isEditMode = ref(route.name === 'edit');

// 初始化时间轴数据
const currentTimeline = ref<Timeline>({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  nodes: [
    {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      tasks: [],
      completed: false,
      createdAt: Date.now(),
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const addNodeBefore = (index: number) => {
  const newNode: ITimelineNode = {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    tasks: [],
    completed: false,
    createdAt: Date.now(),
  };
  currentTimeline.value.nodes.splice(index, 0, newNode);
};

const addNodeAfter = (index: number) => {
  addNodeBefore(index + 1);
};

// 修改编辑任务的逻辑
const editingTask = ref({
  isEditing: false,
  editCache: {
    name: '',
    description: ''
  },
  position: {
    top: 0,
    left: 0
  },
  currentTask: null as Task | null
});

const startTaskEditing = (node: ITimelineNode, taskIndex: number, event: MouseEvent) => {
  const task = node.tasks[taskIndex] as EditingTask
  task.isEditing = true
  task.editCache = {
    name: task.name,
    description: task.description
  }
  // 计算编辑框位置
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  editingTask.value.position = {
    top: rect.top,
    left: rect.left
  }
};

// 添加一个临时任务的 ref
const tempTask = ref<EditingTask | null>(null);

const addTask = (nodeIndex: number) => {
  // 创建临时任务
  tempTask.value = {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    completed: false,
    createdAt: Date.now(),
    isEditing: true,
    editCache: {
      name: '',
      description: '',
    },
    nodeIndex, // 保存节点索引以便后续保存
  };
};

const saveEditing = (task: EditingTask) => {
  if (task === tempTask.value) {
    // 保存临时任务
    if (task.editCache?.name) {
      // 只有当名称不为空时才保存
      const node = currentTimeline.value.nodes[task.nodeIndex!];
      if (node) {
        node.tasks.push({
          id: task.id,
          name: task.editCache.name,
          description: task.editCache.description || '',
          completed: false,
          createdAt: task.createdAt,
        });
      }
    }
    tempTask.value = null;
  } else {
    // 保存现有任务的编辑
    if (task.editCache) {
      task.name = task.editCache.name;
      task.description = task.editCache.description;
    }
    task.isEditing = false;
  }
};

const cancelTaskEditing = (task: EditingTask) => {
  if (task === tempTask.value) {
    // 取消临时任务
    tempTask.value = null;
  } else {
    // 取消现有任务的编辑
    task.isEditing = false;
    task.editCache = undefined;
  }
};

const deleteTask = (node: ITimelineNode, task: Task) => {
  const index = node.tasks.findIndex((t) => t.id === task.id);
  if (index !== -1) {
    node.tasks.splice(index, 1);
  }
};

const deleteNode = (index: number) => {
  if (currentTimeline.value.nodes.length > 1) {
    currentTimeline.value.nodes.splice(index, 1);
  } else {
    alert('至少需要保留一个节点');
  }
};


const saveTimeline = () => {
  // 验证时间轴标题
  if (!currentTimeline.value.name.trim()) {
    message.error('请输入时间轴标题');
    return;
  }

  // 验证节点标题
  const invalidNodes = currentTimeline.value.nodes.some((node) => !node.name.trim());
  if (invalidNodes) {
    message.error('请为所有节点填写标题');
    return;
  }

  // 验证任务标题
  const invalidTasks = currentTimeline.value.nodes.some((node) => node.tasks.some((task) => !task.name.trim()));
  if (invalidTasks) {
    message.error('请为所有任务填写标题');
    return;
  }

  // 过滤掉未保存的节点和任务
  const validNodes = currentTimeline.value.nodes.filter((node) => node.name.trim());
  currentTimeline.value.nodes = validNodes.map((node) => ({
    ...node,
    tasks: node.tasks.filter((task) => task.name.trim()),
  }));

  if (route.params.id) {
    store.updateTimeline(currentTimeline.value);
  } else {
    store.createTimeline(currentTimeline.value);
  }

  isEditMode.value = false;
  message.success('保存成功');
};

// 添加返回首页按钮
const goBack = () => {
  router.push('/');
};

// 修改任务完成处理函数
const handleTaskComplete = (node: ITimelineNode) => {
  const allTasksCompleted = node.tasks.every((task) => task.completed);

  if (allTasksCompleted) {
    const allNodesCompleted = currentTimeline.value.nodes.every((n) => n.tasks.every((t) => t.completed));

    if (allNodesCompleted) {
      // 显示确认弹窗
      Modal.confirm({
        title: '完成确认',
        content: '你已经完成了所有任务，是否确认完成本次 SOP 执行？',
        okText: '确认完成',
        cancelText: '继续检查',
        centered: true,
        onOk() {
          // 显示庆祝通知
          Modal.success({
            title: '太棒了！🎉',
            content: '你已经完成了所有任务！继续保持这样的热情，你正在变得越来越优秀！',
            centered: true,
            okText: '继续前进',
            class: 'celebration-modal',
            onOk() {
              // 重置所有任务的完成状态
              currentTimeline.value.nodes.forEach((node) => {
                node.tasks.forEach((task) => {
                  task.completed = false;
                });
              });
              // 保存更新后的状态
              store.updateTimeline(currentTimeline.value);
            },
          });
        },
      });
    } else {
      // 显示节点完成通知
      Modal.success({
        title: '做得好！👏',
        content: '你完成了这个节点的所有任务！继续前进，你离目标又近了一步！',
        centered: true,
        okText: '继续加油',
      });
    }
  }
};

// 检查当前时间轴是否有已完成的任务
const hasCompletedTasks = computed(() => {
  return currentTimeline.value.nodes.some((node) => node.tasks.some((task) => task.completed));
});

// 重置当前时间轴的所有任务状态
const resetAllTasks = () => {
  Modal.confirm({
    title: '确认重置',
    content: '确定要重置所有任务的完成状态吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      currentTimeline.value.nodes.forEach((node) => {
        node.tasks.forEach((task) => {
          task.completed = false;
        });
      });
      store.updateTimeline(currentTimeline.value);
      message.success('已重置所有任务状态');
    },
  });
};

// 保存原始数据用于取消编辑
const originalTimeline = ref<Timeline | null>(null);

// 进入编辑模式
const enterEditMode = () => {
  // 保存当前状态用于取消
  originalTimeline.value = JSON.parse(JSON.stringify(currentTimeline.value));
  isEditMode.value = true;
};

// 退出编辑模式
const cancel = () => {
  if (isEditMode.value) {
    if (originalTimeline.value) {
      // 恢复原始数据
      currentTimeline.value = JSON.parse(JSON.stringify(originalTimeline.value));
    }
    isEditMode.value = false;
  } else {
    goBack();
  }
};

onMounted(() => {
  if (route.params.id) {
    // 编辑现有时间轴
    const timeline = store.getTimelineById(route.params.id as string);
    if (timeline) {
      currentTimeline.value = { ...timeline };
      // 编辑现有时间轴时默认为预览态
      isEditMode.value = false;
      // 保存原始数据
      originalTimeline.value = JSON.parse(JSON.stringify(timeline));
    }
  } else {
    // 新建时间轴时默认为编辑态
    isEditMode.value = true;
  }
});
</script>

<style scoped>
.editor {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
}

.timeline-nodes {
  padding: 20px 40px;
  display: flex;
  position: relative;
  overflow-x: auto;
}

.nodes-container {
  display: flex;
  gap: 20px;
}

.add-node-btn {
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.add-node-btn.left {
  left: 0;
  margin-right: 20px;
}

.add-node-btn.right {
  right: 0;
  margin-left: 20px;
}

/* 修改庆祝弹窗样式 */
:deep(.celebration-modal) {
  .ant-modal-content {
    background: linear-gradient(135deg, #fff9c4 0%, #ffffff 100%);
    border: 1px solid #ffd54f;
  }

  .ant-modal-confirm-title {
    font-size: 24px;
    text-align: center;
    color: #f57c00;
  }

  .ant-modal-confirm-content {
    font-size: 16px;
    text-align: center;
    margin-top: 16px;
  }

  .ant-modal-confirm-btns {
    justify-content: center;
    margin-top: 24px;
  }
}
</style>
