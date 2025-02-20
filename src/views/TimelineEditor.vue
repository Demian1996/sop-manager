<template>
  <div class="editor" v-if="currentTimeline">
    <TimelineHeader
      :isEditMode="true"
      :title="currentTimeline.name"
      @back="goBack"
      @update:title="(value: string) => (currentTimeline.name = value)"
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

      <Draggable :list="currentTimeline.nodes" item-key="id" class="nodes-container" handle=".drag-handle">
        <template #item="{ element, index }">
          <div class="item">
            <TimelineNode :timeline="currentTimeline" :node="element" :index="index" :isEditMode="true" />
          </div>
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
import { useRoute, useRouter } from 'vue-router';
import { useTimelineStore } from '@/stores/timeline';
import type { Timeline } from '@/types/sop';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import Draggable from 'vuedraggable';
import TimelineHeader from '@/components/TimelineHeader.vue';
import TimelineNode from '@/components/TimelineNode.vue';
import { addNodeBefore, addNodeAfter, validateTimeline, createEmptyTimeline } from '@/utils/timeline';

const store = useTimelineStore();
const route = useRoute();
const router = useRouter();

// 从路由参数获取 timeline id
const timelineId = route.params.id as string;
const isEditPage = !!timelineId;

const currentTimeline = ref<Timeline>(
  isEditPage
    ? JSON.parse(JSON.stringify(store.getTimelineById(timelineId) as Timeline))
    : createEmptyTimeline()
);

const save = () => {
  if (!validateTimeline(currentTimeline.value)) return;
  if (isEditPage) {
    store.updateTimeline(currentTimeline.value);
    message.success('更新成功');
  } else {
    store.createTimeline(currentTimeline.value);
    message.success('创建成功');
  }
  router.push('/');
};

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
