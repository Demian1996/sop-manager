<template>
  <transition name="message-fade">
    <div 
      v-if="visible" 
      class="ghibli-message-container"
      :class="[`ghibli-message-${type}`]"
    >
      <div class="ghibli-message-content">
        <i class="message-icon" :class="iconClass"></i>
        <span class="message-text">{{ content }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface Props {
  content: string;
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  type: 'info'
});

const visible = ref(false);

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'fas fa-check-circle';
    case 'error':
      return 'fas fa-times-circle';
    case 'warning':
      return 'fas fa-exclamation-circle';
    default:
      return 'fas fa-info-circle';
  }
});

onMounted(() => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, props.duration);
});
</script>

<style scoped>
.ghibli-message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  padding: 10px 20px;
  border-radius: 8px;
  background: #fdfbec;
  box-shadow: 3px 3px 0 rgba(139, 159, 120, 0.3);
  border: 2px solid #8b9f78;
  font-family: 'ZCOOL XiaoWei', serif;
}

.ghibli-message-content {
  display: flex;
  align-items: center;
}

.message-icon {
  margin-right: 8px;
  font-size: 16px;
}

.message-text {
  font-size: 15px;
  color: #5c4b51;
}

.ghibli-message-success {
  border-color: #8b9f78;
}

.ghibli-message-success .message-icon {
  color: #8b9f78;
}

.ghibli-message-error {
  border-color: #e57373;
}

.ghibli-message-error .message-icon {
  color: #e57373;
}

.ghibli-message-warning {
  border-color: #ffb74d;
}

.ghibli-message-warning .message-icon {
  color: #ffb74d;
}

.ghibli-message-info {
  border-color: #64b5f6;
}

.ghibli-message-info .message-icon {
  color: #64b5f6;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 