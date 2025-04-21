<template>
  <div class="header-actions">
    <label class="import-button">
      <input type="file" accept=".json" @change="handleFileChange" class="hidden" />
      <GhibliButton>
        <template #icon>
          <i class="fas fa-cloud-upload-alt"></i>
        </template>
        导入
      </GhibliButton>
    </label>
    <GhibliButton @click="$emit('export')">
      <template #icon>
        <i class="fas fa-cloud-download-alt"></i>
      </template>
      导出
    </GhibliButton>
  </div>
</template>

<script setup lang="ts">
import GhibliButton from './GhibliButton.vue';

const emit = defineEmits<{
  (e: 'import', file: File): void;
  (e: 'export'): void;
}>();

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    emit('import', input.files[0]);
  }
};
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 16px;
}

.hidden {
  display: none;
}

.import-button {
  margin-right: 0;
  cursor: pointer;
}

@media (max-width: 768px) {
  .header-actions {
    gap: 12px;
  }
}
</style>
