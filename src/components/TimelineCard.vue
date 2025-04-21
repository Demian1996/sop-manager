<template>
  <div class="timeline-card" @click="$emit('run')">
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title" :title="timeline.name">{{ timeline.name }}</h3>
        <div class="timeline-actions">
          <button class="action-button duplicate" @click.stop="$emit('duplicate')" title="克隆">
            <i class="fas fa-copy"></i>
          </button>
          <button class="action-button edit" @click.stop="$emit('edit')" title="编辑">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-button delete" @click.stop="$emit('delete')" title="删除">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <div class="card-info">
        <span class="node-count">
          <i class="fas fa-sitemap"></i>
          {{ timeline.nodes.length }} 个节点
        </span>
      </div>
    </div>
    <div class="card-background"></div>
  </div>
</template>

<script setup lang="ts">
import type { Timeline } from '../types/sop';

defineProps<{
  timeline: Timeline;
}>();

defineEmits<{
  (e: 'run'): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
  (e: 'duplicate'): void;
}>();
</script>

<style scoped>
.timeline-card {
  aspect-ratio: 16/10;
  border-radius: 8px;
  background: #fdfbec;
  border: 2px solid #8b9f78;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  box-shadow: 4px 4px 0 #8b9f78;
}

.timeline-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 8px 8px 0 #8b9f78;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(168, 209, 168, 0.1) 0%, rgba(138, 179, 168, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-card:hover .card-background {
  opacity: 1;
}

.card-content {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  font-family: 'ZCOOL XiaoWei', serif;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-title {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
  color: #5c4b51;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
  position: relative;
}

.card-title::after {
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

.timeline-card:hover .card-title::after {
  transform: scaleX(1);
}

.card-info {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.node-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8b9f78;
  font-weight: 500;
}

.timeline-actions {
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-card:hover .timeline-actions {
  opacity: 1;
}

.action-button {
  width: 32px;
  height: 32px;
  border: 2px solid #8b9f78;
  border-radius: 4px;
  background: #fdfbec;
  color: #5c4b51;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 2px 2px 0 #8b9f78;
}

.action-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #8b9f78;
  background: #fff;
}

.action-button:active {
  transform: translate(0, 0);
  box-shadow: 0 0 0 #8b9f78;
}

.action-button.duplicate:hover {
  color: #8b9f78;
}

.action-button.edit:hover {
  color: #8b9f78;
}

.action-button.delete:hover {
  color: #e57373;
  border-color: #e57373;
  box-shadow: 4px 4px 0 #e57373;
}

@media (max-width: 768px) {
  .timeline-card {
    aspect-ratio: auto;
    height: 160px;
  }

  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
    max-width: 60%;
  }

  .action-button {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}
</style> 