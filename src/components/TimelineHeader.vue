<template>
  <div class="header">
    <div class="title-bar">
      <div class="left-section">
        <button class="magical-button back-button" @click="$emit('back')">
          <span class="button-content">
            <i class="fas fa-arrow-left"></i>
            返回
          </span>
        </button>
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

.timeline-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #5c4b51;
  font-family: 'ZCOOL XiaoWei', serif;
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

  .magical-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
