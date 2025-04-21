<template>
  <div class="timeline-card add-card" @click="$emit('click')">
    <div class="add-content">
      <div class="plus-container">
        <div class="plus">+</div>
        <div class="plus-glow"></div>
      </div>
      <span class="add-text">新建时间轴</span>
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
  border-radius: 8px;
  background: #fdfbec;
  border: 2px dashed #8b9f78;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 4px 4px 0 rgba(139, 159, 120, 0.3);
}

.add-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 8px 8px 0 rgba(139, 159, 120, 0.3);
  border-style: solid;
}

.add-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #5c4b51;
  position: relative;
  z-index: 1;
  font-family: 'ZCOOL XiaoWei', serif;
}

.plus-container {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
}

.plus {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  font-weight: 300;
  color: #8b9f78;
  transition: all 0.3s ease;
}

.plus-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(139, 159, 120, 0.2) 0%, rgba(139, 159, 120, 0) 70%);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.add-text {
  font-size: 16px;
  font-weight: 500;
  color: #5c4b51;
  transition: all 0.3s ease;
}

.add-card:hover .plus {
  transform: translate(-50%, -50%) scale(1.1);
  color: #8b9f78;
}

.add-card:hover .add-text {
  color: #8b9f78;
}

@keyframes borderGlow {
  0% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .timeline-card {
    aspect-ratio: auto;
    height: 160px;
  }

  .plus-container {
    width: 50px;
    height: 50px;
  }

  .plus {
    font-size: 32px;
  }

  .plus-glow {
    width: 50px;
    height: 50px;
  }

  .add-text {
    font-size: 14px;
  }
}
</style> 