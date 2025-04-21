<template>
  <div class="container">
    <div class="magical-background">
      <div class="clouds"></div>
      <div class="trees"></div>
    </div>
    
    <header class="header">
      <div class="header-content">
        <h1 class="ghibli-title">SOP 管理器</h1>
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
        @duplicate="duplicateTimeline(timeline.id)"
      />

      <AddTimelineCard @click="goToCreate" />
    </div>

    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} SOP Manager - 工作流管理器</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useTimelineStore } from '@/stores/timeline';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { message } from '@/utils/messageService';
import { modal } from '@/utils/modalService';
import { TimelineCard, TimelineActions, AddTimelineCard } from '@/components';

const store = useTimelineStore();
const router = useRouter();
const { timelines } = storeToRefs(store);

const goToCreate = () => router.push('/create');
const goToEdit = (id: string) => router.push(`/edit/${id}`);
const goToRun = (id: string) => router.push(`/run/${id}`);

const confirmDelete = (id: string) => {
  modal.confirm({
    title: '确认删除',
    content: '确定要删除这个时间轴吗？',
    okText: '确定',
    cancelText: '取消',
    danger: true,
    onOk() {
      store.deleteTimeline(id);
      message.success('删除成功');
    }
  });
};

const duplicateTimeline = (id: string) => {
  store.duplicateTimeline(id);
  message.success('复制成功');
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
  background: linear-gradient(135deg, #e8f3d6 0%, #fdfbec 100%);
  position: relative;
  overflow: hidden;
}

.magical-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23a8d1a8' fill-opacity='0.1' d='M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
}

.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.3' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: cover;
  animation: float 20s infinite linear;
}

.trees {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 200px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23a8d1a8' fill-opacity='0.2' d='M0,288L48,272C96,256,192,224,288,224C384,224,480,256,576,272C672,288,768,288,864,272C960,256,1056,224,1152,224C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: cover;
}

.header {
  padding: 40px 40px 20px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ghibli-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #5c4b51;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'ZCOOL XiaoWei', serif;
  position: relative;
  display: inline-block;
  letter-spacing: 1px;
}

.ghibli-title::after {
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

.ghibli-title:hover::after {
  transform: scaleX(1);
}

.timeline-list {
  padding: 20px 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.footer {
  text-align: center;
  padding: 20px;
  color: #5c4b51;
  font-size: 14px;
  position: relative;
  z-index: 1;
  font-family: 'ZCOOL XiaoWei', serif;
}

@keyframes float {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 20px 20px 10px;
  }

  .timeline-list {
    padding: 10px 20px;
    grid-template-columns: 1fr;
  }

  .ghibli-title {
    font-size: 24px;
  }
}
</style>
