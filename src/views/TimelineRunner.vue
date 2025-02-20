<template>
  <div class="editor" v-if="currentTimeline">
    <TimelineHeader
      :isEditMode="true"
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
          <TimelineNode :timeline="currentTimeline" :node="node" :index="index" :isEditMode="true" />
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTimelineStore } from '@/stores/timeline';
import type { Timeline } from '@/types/sop';
import { message } from 'ant-design-vue';
import Draggable from 'vuedraggable';
import TimelineHeader from '@/components/TimelineHeader.vue';
import TimelineNode from '@/components/TimelineNode.vue';

const store = useTimelineStore();
const route = useRoute();
const router = useRouter();

// 从路由参数获取 timeline id
const timelineId = route.params.id as string;

const currentTimeline = ref<Timeline>(JSON.parse(JSON.stringify(store.getTimelineById(timelineId) as Timeline)));

const goBack = () => {
  router.push('/');
};
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
