<template>
  <div class="editor" v-if="currentTimeline">
    <div class="magical-background">
      <div class="clouds"></div>
      <div class="trees"></div>
    </div>

    <TimelineHeader
      :isEditMode="false"
      :title="currentTimeline.name"
      @back="goBack"
    >
      <template #actions>
        <button class="magical-button reset-button" @click="resetAllTasks">
          <span class="button-content">
            <i class="fas fa-redo-alt"></i>
            重置进度
          </span>
        </button>
      </template>
    </TimelineHeader>

    <div class="timeline-nodes">
      <Draggable v-model="currentTimeline.nodes" item-key="id" class="nodes-container" handle=".drag-handle">
        <template #item="{ element: node }">
          <div class="item">
            <TimelineNode
              :title="node.name"
              :description="node.description"
              :tasks="node.tasks"
              :isEditMode="false"
              :isCompleted="isNodeCompleted(node)"
              :canMoveUp="false"
              :canMoveDown="false"
              @updateTask="updateTask"
            />
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
import type { Timeline, TimelineNode as ITimelineNode, Task } from '@/types/sop';
import { Modal } from 'ant-design-vue';
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

const resetAllTasks = () => {
  Modal.confirm({
    title: '确认重置',
    content: '确定要重置所有任务的进度吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      store.resetAllTasks(currentTimeline.value);
    }
  });
};

const isNodeCompleted = (node: ITimelineNode): boolean => {
  return node.tasks.every((task: Task) => task.completed);
};

const updateTask = (task: Task) => {
  // 任务状态已经在组件中更新，这里不需要额外操作
  // 但我们需要保持这个事件处理器来维护接口一致性
};

// 监听任务状态变化
watch(
  () => JSON.stringify(currentTimeline.value.nodes),
  () => {
    checkAllTasksCompleted();
  },
  { deep: true }
);

const checkAllTasksCompleted = () => {
  const allNodes = currentTimeline.value.nodes;
  const allCompleted = allNodes.every(node => isNodeCompleted(node));

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
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23a8d1a8' fill-opacity='0.1' d='M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
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
}

.magical-button {
  position: relative;
  padding: 8px 16px;
  border: 2px solid #8b9f78;
  border-radius: 8px;
  background: #fdfbec;
  color: #5c4b51;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 2px 2px 0 #8b9f78;
  font-family: 'ZCOOL XiaoWei', serif;
}

.magical-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #8b9f78;
  background: #fff;
}

.magical-button:active {
  transform: translate(0, 0);
  box-shadow: 0 0 0 #8b9f78;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.reset-button {
  color: #e57373;
  border-color: #e57373;
}

.reset-button:hover {
  box-shadow: 4px 4px 0 #e57373;
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

  .magical-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
