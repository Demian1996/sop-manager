<template>
  <div class="timeline-container">
    <div class="controls">
      <button @click="createNewTimeline">新建时间轴</button>
      <button @click="exportData">导出数据</button>
    </div>
    
    <div class="timelines">
      <div v-for="timeline in timelines" :key="timeline.id" class="timeline">
        <h2>{{ timeline.name }}</h2>
        <div class="timeline-nodes">
          <div v-for="node in timeline.nodes" :key="node.id" class="node">
            <div class="node-header">
              <h3>{{ node.name }}</h3>
              <button @click="addTask(timeline.id, node.id)">添加任务</button>
            </div>
            <div class="tasks">
              <div v-for="task in node.tasks" :key="task.id" class="task">
                <input type="checkbox" v-model="task.completed">
                <span>{{ task.name }}</span>
              </div>
            </div>
            <button @click="addNode(timeline.id)">添加节点</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimelineStore } from '../stores/timeline'
import { storeToRefs } from 'pinia'

const store = useTimelineStore()
const { timelines } = storeToRefs(store)

const createNewTimeline = () => {
  const name = prompt('请输入时间轴名称')
  if (name) {
    store.createTimeline(name, '')
  }
}

const addNode = (timelineId: string) => {
  const name = prompt('请输入节点名称')
  if (name) {
    store.addNode(timelineId, name, '')
  }
}

const addTask = (timelineId: string, nodeId: string) => {
  const name = prompt('请输入任务名称')
  if (name) {
    store.addTask(timelineId, nodeId, name, '')
  }
}

const exportData = () => {
  const data = store.exportData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sop-data.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.timeline-container {
  padding: 20px;
}

.timeline-nodes {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 20px 0;
}

.node {
  min-width: 300px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.tasks {
  margin: 10px 0;
}

.task {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
}
</style> 