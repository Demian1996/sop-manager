<template>
  <div class="timeline-card" @click="$emit('run')">
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title" :title="timeline.name">{{ timeline.name }}</h3>
        <div class="timeline-actions">
          <a-tooltip title="编辑">
            <EditOutlined class="action-icon" @click.stop="$emit('edit')" />
          </a-tooltip>
          <a-tooltip title="删除">
            <DeleteOutlined class="action-icon delete" @click.stop="$emit('delete')" />
          </a-tooltip>
        </div>
      </div>
      <div class="card-info">
        <span class="node-count">{{ timeline.nodes.length }} 个节点</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { Timeline } from '../types/sop';

defineProps<{
  timeline: Timeline;
}>();

defineEmits<{
  (e: 'run'): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();
</script>

<style scoped>
.timeline-card {
  aspect-ratio: 16/10;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.card-info {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.timeline-actions {
  display: flex;
  gap: 12px;
}

.action-icon {
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-icon:hover {
  transform: scale(1.1);
}

.action-icon.delete:hover {
  color: #ff4d4f;
}

:deep(.anticon) {
  vertical-align: middle;
}
</style> 