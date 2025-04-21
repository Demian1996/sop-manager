<template>
  <transition name="modal-fade">
    <div class="ghibli-modal-container" v-if="visible">
      <div class="ghibli-modal-backdrop" @click="handleCancel"></div>
      <div class="ghibli-modal" :style="{ width: width }">
        <div class="ghibli-modal-content">
          <h3 class="ghibli-modal-title">{{ title }}</h3>
          <p class="ghibli-modal-text">{{ content }}</p>
          <div class="ghibli-modal-actions">
            <button v-if="showCancel" class="magical-button cancel-button" @click="handleCancel">
              <span class="button-content">{{ cancelText }}</span>
            </button>
            <button class="magical-button" :class="{ 'delete-button': danger }" @click="handleOk">
              <span class="button-content">{{ okText }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  visible: boolean;
  width?: string;
  showCancel?: boolean;
  danger?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  okText: '确定',
  cancelText: '取消',
  width: '400px',
  showCancel: true,
  danger: false
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
}>();

const handleOk = () => {
  emit('ok');
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};
</script>

<style scoped>
.ghibli-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ghibli-modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.ghibli-modal {
  background: #fdfbec;
  border: 2px solid #8b9f78;
  border-radius: 16px;
  padding: 0;
  max-width: 90%;
  box-shadow: 6px 6px 0 rgba(139, 159, 120, 0.3);
  position: relative;
  overflow: hidden;
}

.ghibli-modal-content {
  padding: 24px;
}

.ghibli-modal-title {
  margin: 0 0 16px;
  color: #5c4b51;
  font-size: 22px;
  font-family: 'ZCOOL XiaoWei', serif;
  font-weight: 600;
  position: relative;
}

.ghibli-modal-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #8b9f78, transparent);
}

.ghibli-modal-text {
  margin: 16px 0 24px;
  color: #5c4b51;
  font-size: 16px;
  line-height: 1.5;
  font-family: 'ZCOOL XiaoWei', serif;
}

.ghibli-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
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

.cancel-button {
  background: transparent;
}

.delete-button {
  border-color: #e57373;
  color: #e57373;
}

.delete-button:hover {
  box-shadow: 4px 4px 0 #e57373;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .ghibli-modal {
  animation: modalAppear 0.3s ease-out;
}

.modal-fade-leave-active .ghibli-modal {
  animation: modalAppear 0.2s ease-in reverse;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .ghibli-modal-title {
    font-size: 20px;
  }
  
  .ghibli-modal-text {
    font-size: 15px;
  }
  
  .magical-button {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style> 