<template>
  <div class="editor" v-if="currentTimeline">
    <TimelineHeader
      :isEditMode="false"
      :title="currentTimeline.name"
      @back="goBack"
      @update:title="(value: string) => (currentTimeline.name = value)"
    >
      <template #actions>
        <a-button @click="resetAllTasks">
          <template #icon><reload-outlined /></template>
          重置进度
        </a-button>
      </template>
    </TimelineHeader>

    <div class="timeline-nodes">
      <Draggable v-model="currentTimeline.nodes" item-key="id" class="nodes-container" handle=".drag-handle">
        <template #item="{ element: node, index }">
          <div class="item">
            <TimelineNode :timeline="currentTimeline" :node="node" :index="index" :isEditMode="false" />
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTimelineStore } from '@/stores/timeline';
import type { Timeline } from '@/types/sop';
import { Modal } from 'ant-design-vue';
import Draggable from 'vuedraggable';
import TimelineHeader from '@/components/TimelineHeader.vue';
import TimelineNode from '@/components/TimelineNode.vue';
import { ReloadOutlined } from '@ant-design/icons-vue';

const store = useTimelineStore();
const route = useRoute();
const router = useRouter();

// 从路由参数获取 timeline id
const timelineId = route.params.id as string;

const currentTimeline = ref<Timeline>(JSON.parse(JSON.stringify(store.getTimelineById(timelineId) as Timeline)));

const goBack = () => {
  router.push('/');
};

const resetAllTasks = () => {
  store.resetAllTasks(currentTimeline.value);
};

const checkAllTasksCompleted = () => {
  const allNodes = currentTimeline.value.nodes;
  const allCompleted = allNodes.every((node) => node.tasks.every((task) => task.completed));

  if (allCompleted) {
    Modal.success({
      title: '🎉 太棒了！',
      content: '你已经完成了所有任务！继续保持！',
      okText: '好的',
      class: 'celebration-modal',
      onOk: () => {
        // 重置状态
        store.resetAllTasks(currentTimeline.value);
      },
    });
  }
};

// 监听任务状态变化
watch(
  () => JSON.stringify(currentTimeline.value.nodes),
  () => {
    checkAllTasksCompleted();
  },
  { deep: true }
);

// 初始检查
checkAllTasksCompleted();
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
</style>
