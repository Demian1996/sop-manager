<template>
  <div class="container">
    <header class="header">
      <div class="header-content">
        <h1>SOP 管理器</h1>
        <TimelineActions @import="handleImport" @export="handleExport" />
      </div>
    </header>

    <div class="timeline-list">
      <TimelineCard
        v-for="timeline in timelines"
        :key="timeline.id"
        :timeline="timeline"
        @run="goToRun(timeline.id)"
        @edit="goToEdit(timeline.id)"
        @delete="confirmDelete(timeline.id)"
      />

      <AddTimelineCard @click="goToCreate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimelineStore } from '@/stores/timeline'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import TimelineCard from '@/components/TimelineCard.vue';
import TimelineActions from '@/components/TimelineActions.vue';
import AddTimelineCard from '@/components/AddTimelineCard.vue';

const store = useTimelineStore();
const router = useRouter();
const { timelines } = storeToRefs(store);

const goToCreate = () => router.push('/create');
const goToEdit = (id: string) => router.push(`/edit/${id}`);
const goToRun = (id: string) => router.push(`/run/${id}`);

const confirmDelete = (id: string) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个时间轴吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      store.deleteTimeline(id);
      message.success('删除成功');
    }
  });
};

// 导出功能
const handleExport = () => {
  const data = store.exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sop-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  message.success('导出成功');
};

// 导入功能
const handleImport = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      // 验证数据格式
      if (Array.isArray(data) && data.every((item) => item.id && item.name && Array.isArray(item.nodes))) {
        store.$state.timelines = data;
        message.success('导入成功');
      } else {
        message.error('数据格式不正确');
      }
    } catch (err) {
      message.error('导入失败，请检查文件格式');
    }
  };
  reader.readAsText(file);
  return false; // 阻止自动上传
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  padding: 40px 40px 20px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
}

.timeline-list {
  padding: 20px 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

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
}

.card-info {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.add-card {
  border: 2px dashed #ddd;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-card:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.add-content {
  text-align: center;
  color: #666;
}

.plus {
  font-size: 40px;
  font-weight: 300;
  margin-bottom: 8px;
  line-height: 1;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff5252;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-card:hover .delete-btn {
  opacity: 1;
}

@media (max-width: 768px) {
  .header {
    padding: 20px 20px 10px;
  }

  .timeline-list {
    padding: 10px 20px;
    grid-template-columns: 1fr;
  }

  .timeline-card {
    aspect-ratio: auto;
    height: 160px;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-card:hover .delete-btn {
  opacity: 1;
}
</style>
