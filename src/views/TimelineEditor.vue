<template>
  <div class="editor" v-if="currentTimeline">
    <TimelineHeader
      :isEditMode="true"
      :title="currentTimeline.name"
      @back="goBack"
      @update:title="(value: string) => (currentTimeline.name = value)"
    >
      <template #actions>
        <GhibliButton type="outline" @click="goBack">取消</GhibliButton>
        <GhibliButton type="primary" @click="save">保存</GhibliButton>
      </template>
    </TimelineHeader>

    <div class="timeline-nodes">
      <div class="magical-background">
        <div class="clouds"></div>
        <div class="trees"></div>
      </div>

      <button 
        class="magical-circle-button left" 
        @click="store.addNodeBefore(currentTimeline, 0)"
      >
        <span class="button-content">
          <i class="fas fa-plus"></i>
        </span>
        <div class="button-glow"></div>
      </button>

      <Draggable :list="currentTimeline.nodes" item-key="id" class="nodes-container" handle=".drag-handle">
        <template #item="{ element, index }">
          <div class="item">
            <TimelineNode :timeline="currentTimeline" :node="element" :index="index" :isEditMode="true" />
          </div>
        </template>
      </Draggable>

      <button 
        class="magical-circle-button right" 
        @click="store.addNodeAfter(currentTimeline, currentTimeline.nodes.length - 1)"
      >
        <span class="button-content">
          <i class="fas fa-plus"></i>
        </span>
        <div class="button-glow"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTimelineStore } from '@/stores/timeline';
import type { Timeline } from '@/types/sop';
import { message } from '@/utils/messageService';
import Draggable from 'vuedraggable';
import { TimelineHeader, TimelineNode, GhibliButton } from '@/components';

const store = useTimelineStore();
const route = useRoute();
const router = useRouter();

// 从路由参数获取 timeline id
const timelineId = route.params.id as string;
const isEditPage = !!timelineId;

const currentTimeline = ref<Timeline>(
  isEditPage
    ? JSON.parse(JSON.stringify(store.getTimelineById(timelineId) as Timeline))
    : store.createEmptyTimeline()
);

const save = () => {
  if (!store.validateTimeline(currentTimeline.value)) return;
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

.magical-circle-button {
  flex-shrink: 0;
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 2px solid #8b9f78;
  border-radius: 50%;
  background: #fdfbec;
  color: #8b9f78;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0 #8b9f78;
}

.magical-circle-button:hover {
  transform: translate(-2px, calc(-50% - 2px));
  box-shadow: 4px 4px 0 #8b9f78;
  background: #fff;
}

.magical-circle-button:active {
  transform: translate(0, -50%);
  box-shadow: 0 0 0 #8b9f78;
}

.magical-circle-button .button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.magical-circle-button .button-glow {
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

.magical-circle-button:hover .button-glow {
  opacity: 1;
  animation: pulse 2s infinite;
}

.magical-circle-button.left {
  left: 0;
  margin-right: 20px;
}

.magical-circle-button.right {
  right: 0;
  margin-left: 20px;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .timeline-nodes {
    padding: 10px 20px;
  }

  .nodes-container {
    gap: 16px;
  }

  .magical-circle-button {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
}

@keyframes float {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}
</style>
