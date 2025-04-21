<template>
  <div class="editor" v-if="currentTimeline">
    <TimelineHeader
      :isEditMode="false"
      :title="currentTimeline.name"
      @back="goBack"
      @update:title="(value: string) => (currentTimeline.name = value)"
    >
      <template #actions>
        <GhibliButton type="outline" @click="resetAllTasks">
          <template #icon>
            <i class="fas fa-redo-alt"></i>
          </template>
          重置进度
        </GhibliButton>
      </template>
    </TimelineHeader>

    <div class="timeline-nodes">
      <div class="magical-background">
        <div class="clouds"></div>
        <div class="trees"></div>
      </div>

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
import { modal } from '@/utils/modalService';
import Draggable from 'vuedraggable';
import { TimelineHeader, TimelineNode, GhibliButton } from '@/components';

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
    modal.success({
      title: '🎉 太棒了！',
      content: '你已经完成了所有任务！继续保持！',
      okText: '好的',
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
  background: linear-gradient(135deg, #e8f3d6 0%, #fdfbec 100%);
  position: relative;
  overflow: hidden;
}

.magical-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.3' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: cover;
  animation: float 20s infinite linear;
}

.trees {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 200px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23a8d1a8' fill-opacity='0.2' d='M0,288L48,272C96,256,192,224,288,224C384,224,480,256,576,272C672,288,768,288,864,272C960,256,1056,224,1152,224C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: cover;
}

.timeline-nodes {
  padding: 20px 40px;
  display: flex;
  position: relative;
  overflow-x: auto;
  z-index: 1;
}

.nodes-container {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  min-width: 100%;
}

@keyframes float {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@media (max-width: 768px) {
  .timeline-nodes {
    padding: 10px 20px;
  }

  .nodes-container {
    gap: 16px;
  }
}
</style>
