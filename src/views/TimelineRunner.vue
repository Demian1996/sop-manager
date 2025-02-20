<template>
  <div class="runner">
    <EditorHeader
      :editable="false"
      :title="currentTimeline.name"
      :has-completed-tasks="hasCompletedTasks"
      @back="goBack"
    >
      <template #actions>
        <a-button 
          @click="resetAllTasks" 
          :disabled="!hasCompletedTasks"
        >
          <template #icon><reload-outlined /></template>
          重置进度
        </a-button>
        <a-button type="primary" @click="goToEdit">
          编辑时间轴
        </a-button>
      </template>
    </EditorHeader>

    <div class="timeline-nodes">
      <div class="nodes-container">
        <TimelineNode
          v-for="node in currentTimeline.nodes"
          :key="node.id"
          :node="node"
          :editable="false"
          :temp-task="null"
          @complete-task="handleTaskComplete(node)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTimelineStore } from '@/stores/timeline';
import { useRoute, useRouter } from 'vue-router';
import type { Timeline, TimelineNode as ITimelineNode } from '@/types/sop';
import { message, Modal } from 'ant-design-vue';
import EditorHeader from '@/components/timeline/EditorHeader.vue';
import TimelineNode from '@/components/timeline/TimelineNode.vue';

const store = useTimelineStore();
const route = useRoute();
const router = useRouter();

const currentTimeline = ref<Timeline>({
  id: '',
  name: '',
  description: '',
  nodes: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// 检查是否有已完成的任务
const hasCompletedTasks = computed(() => {
  return currentTimeline.value.nodes.some((node) => 
    node.tasks.some((task) => task.completed)
  );
});

// 重置所有任务状态
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

// 处理任务完成
const handleTaskComplete = (node: ITimelineNode) => {
  const allTasksCompleted = node.tasks.every((task) => task.completed);

  if (allTasksCompleted) {
    const allNodesCompleted = currentTimeline.value.nodes.every((n) => 
      n.tasks.every((t) => t.completed)
    );

    if (allNodesCompleted) {
      Modal.confirm({
        title: '完成确认',
        content: '你已经完成了所有任务，是否确认完成本次 SOP 执行？',
        okText: '确认完成',
        cancelText: '继续检查',
        centered: true,
        onOk() {
          Modal.success({
            title: '太棒了！🎉',
            content: '你已经完成了所有任务！继续保持这样的热情，你正在变得越来越优秀！',
            centered: true,
            okText: '继续前进',
            class: 'celebration-modal',
            onOk() {
              resetAllTasks();
            },
          });
        },
      });
    } else {
      Modal.success({
        title: '做得好！👏',
        content: '你完成了这个节点的所有任务！继续前进，你离目标又近了一步！',
        centered: true,
        okText: '继续加油',
      });
    }
  }

  // 保存进度
  store.updateTimeline(currentTimeline.value);
};

const goBack = () => {
  router.push('/');
};

const goToEdit = () => {
  router.push(`/edit/${currentTimeline.value.id}`);
};

onMounted(() => {
  if (route.params.id) {
    const timeline = store.getTimelineById(route.params.id as string);
    if (timeline) {
      currentTimeline.value = { ...timeline };
    } else {
      message.error('时间轴不存在');
      router.push('/');
    }
  }
});
</script>

<style scoped>
.runner {
  min-height: 100vh;
  background: #f5f5f5;
}

.timeline-nodes {
  padding: 20px 40px;
  overflow-x: auto;
}

.nodes-container {
  display: flex;
  gap: 20px;
}

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
