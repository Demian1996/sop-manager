<template>
  <div class="header">
    <div class="title-bar">
      <div class="left-section">
        <GhibliButton @click="$emit('back')">
          <template #icon>
            <i class="fas fa-arrow-left"></i>
          </template>
          返回
        </GhibliButton>
        <input
          v-if="isEditMode"
          :value="title"
          placeholder="输入时间轴名称"
          class="timeline-title-input"
          @change="(e: any) => $emit('update:title', e.target.value)"
        />
        <h1 v-else class="timeline-title">{{ title }}</h1>
      </div>
      <div class="action-buttons">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GhibliButton } from '@/components';

defineProps<{
  isEditMode: boolean;
  title: string;
}>();

defineEmits<{
  (e: 'back'): void;
  (e: 'update:title', value: string): void;
}>();
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #8b9f78;
  position: relative;
  z-index: 2;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timeline-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #5c4b51;
  font-family: 'ZCOOL XiaoWei', serif;
  position: relative;
  display: inline-block;
  letter-spacing: 1px;
}

.timeline-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #8b9f78, transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.timeline-title:hover::after {
  transform: scaleX(1);
}

.timeline-title-input {
  font-size: 24px;
  font-weight: 600;
  width: 300px;
  border: none;
  border-bottom: 2px solid #8b9f78;
  padding: 4px 0;
  background: transparent;
  color: #5c4b51;
  font-family: 'ZCOOL XiaoWei', serif;
}

.timeline-title-input:hover,
.timeline-title-input:focus {
  border-bottom-color: #4a6741;
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .title-bar {
    padding: 12px 20px;
  }

  .left-section {
    gap: 12px;
  }

  .timeline-title,
  .timeline-title-input {
    font-size: 20px;
    width: 200px;
  }
}
</style>
