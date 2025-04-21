<template>
  <button 
    class="ghibli-button" 
    :class="[
      type ? `ghibli-button-${type}` : '',
      size ? `ghibli-button-${size}` : '',
      { 'ghibli-button-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="!disabled && $emit('click', $event)"
    :type="htmlType"
  >
    <span class="button-content">
      <slot name="icon"></slot>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'danger' | 'default' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  htmlType: 'button'
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<style scoped>
.ghibli-button {
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
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.ghibli-button:hover:not(.ghibli-button-disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #8b9f78;
  background: #fff;
}

.ghibli-button:active:not(.ghibli-button-disabled) {
  transform: translate(0, 0);
  box-shadow: 0 0 0 #8b9f78;
}

/* 类型变体 */
.ghibli-button-primary {
  background: #8b9f78;
  color: #ffffff;
}

.ghibli-button-primary:hover:not(.ghibli-button-disabled) {
  background: #7a8c69;
}

.ghibli-button-danger {
  border-color: #e57373;
  color: #e57373;
}

.ghibli-button-danger:hover:not(.ghibli-button-disabled) {
  box-shadow: 4px 4px 0 #e57373;
}

.ghibli-button-outline {
  background: transparent;
}

.ghibli-button-outline:hover:not(.ghibli-button-disabled) {
  background: rgba(139, 159, 120, 0.1);
}

/* 尺寸变体 */
.ghibli-button-small {
  padding: 6px 12px;
  font-size: 12px;
  border-width: 1px;
  box-shadow: 1px 1px 0 #8b9f78;
}

.ghibli-button-small:hover:not(.ghibli-button-disabled) {
  box-shadow: 2px 2px 0 #8b9f78;
}

.ghibli-button-large {
  padding: 10px 20px;
  font-size: 16px;
}

/* 禁用状态 */
.ghibli-button-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .ghibli-button {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .ghibli-button-small {
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .ghibli-button-large {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style> 