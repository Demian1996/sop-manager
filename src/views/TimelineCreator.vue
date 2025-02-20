<template>
  <div class="creator">
    <TimelineHeader
      :isEditMode="true"
      :title="currentTimeline.name"
      @back="goBack"
      @updateTitle="(value) => (currentTimeline.name = value)"
    >
      <template #actions>
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="save">保存</a-button>
      </template>
    </TimelineHeader>

    <div class="timeline-nodes">
      <a-button type="primary" shape="circle" class="add-node-btn left" @click="addNodeBefore(currentTimeline, 0)">
        <template #icon><plus-outlined /></template>
      </a-button>

      <Draggable
        v-model="currentTimeline.nodes"
        item-key="id"
        class="nodes-container"
        handle=".drag-handle"
      >
        <template #item="{ element: node, index }">
          <TimelineNode
            :timeline="currentTimeline"
            :node="node"
            :index="index"
            :isEditMode="true"
          />
        </template>
      </Draggable>

      <a-button
        type="primary"
        shape="circle"
        class="add-node-btn right"
        @click="addNodeAfter(currentTimeline, currentTimeline.nodes.length - 1)"
      >
        <template #icon><plus-outlined /></template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTimelineStore } from '@/stores/timeline';
import type { Timeline } from '@/types/sop';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import Draggable from 'vuedraggable';
import TimelineHeader from '@/components/TimelineHeader.vue';
import TimelineNode from '@/components/TimelineNode.vue';
import {
  createEmptyTimeline,
  addNodeBefore,
  addNodeAfter,
  validateTimeline,
} from '@/utils/timeline';

const store = useTimelineStore();
const router = useRouter();

// 初始化时间轴数据
const currentTimeline = ref<Timeline>(createEmptyTimeline());

const save = () => {
  if (!validateTimeline(currentTimeline.value)) return;
  store.createTimeline(currentTimeline.value);
  message.success('创建成功');
  router.push('/');
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.creator {
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
