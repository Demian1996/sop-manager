<template>
  <div class="timeline-card add-card" @click="$emit('click')">
    <div class="add-content">
      <div class="plus">+</div>
      <span>新建时间轴</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped>
.timeline-card {
  aspect-ratio: 16/10;
  border-radius: 16px;
  background: transparent;
  border: 2px dashed #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-card:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.add-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.plus {
  font-size: 40px;
  font-weight: 300;
  margin-bottom: 8px;
  line-height: 1;
}
</style> 