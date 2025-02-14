<template>
  <div class="editor">
    <div class="header">
      <div class="title-bar">
        <div class="left-section">
          <a-button @click="goBack">
            <template #icon><arrow-left-outlined /></template>
            返回
          </a-button>
          <a-input
            v-if="isEditMode"
            v-model:value="currentTimeline.name"
            placeholder="输入时间轴名称"
            class="timeline-title-input"
          />
          <h1 v-else class="timeline-title">{{ currentTimeline.name }}</h1>
        </div>
        <div class="action-buttons">
          <a-button type="primary" @click="isEditMode = !isEditMode">
            {{ isEditMode ? '预览' : '编辑' }}
          </a-button>
          <a-button
            v-if="isEditMode"
            type="primary"
            @click="saveTimeline"
          >
            保存
          </a-button>
        </div>
      </div>
    </div>

    <div class="timeline-nodes">
      <a-button
        v-if="isEditMode"
        type="primary"
        shape="circle"
        class="add-node-btn left"
        @click="addNodeBefore(0)"
      >
        <template #icon><plus-outlined /></template>
      </a-button>

      <draggable
        v-model="currentTimeline.nodes"
        :disabled="!isEditMode"
        item-key="id"
        class="nodes-container"
        handle=".drag-handle"
        @end="handleDragEnd"
      >
        <template #item="{ element: node, index }">
          <a-card 
            v-if="isEditMode || node.name.trim()"
            class="node" 
            :bordered="true"
          >
            <template #title>
              <div class="node-header">
                <MenuOutlined v-if="isEditMode" class="drag-handle" />
                <a-input
                  v-if="isEditMode"
                  v-model:value="node.name"
                  placeholder="节点名称"
                  :bordered="false"
                />
                <span v-else>{{ node.name }}</span>
              </div>
            </template>
            <template #extra v-if="isEditMode">
              <a-button
                type="text"
                danger
                @click="deleteNode(index)"
                class="delete-btn"
              >
                <template #icon><delete-outlined /></template>
              </a-button>
            </template>

            <div class="tasks">
              <div v-for="(task, taskIndex) in node.tasks" 
                   :key="task.id" 
                   class="task"
                   :class="{ 'completed': task.completed }">
                <div v-if="!task.isEditing" 
                     class="task-content"
                     @click="isEditMode && startEditing(node, taskIndex)">
                  <div class="task-header">
                    <span class="task-name">{{ task.name || '未命名任务' }}</span>
                    <div class="task-actions">
                      <a-checkbox
                        v-if="!isEditMode"
                        v-model:checked="task.completed"
                        @click.stop
                        @change="handleTaskComplete(node)"
                      />
                      <a-button
                        v-if="isEditMode"
                        type="text"
                        danger
                        size="small"
                        @click.stop="deleteTask(node, task)"
                      >
                        <template #icon><delete-outlined /></template>
                      </a-button>
                    </div>
                  </div>
                </div>
                
                <div v-else class="task-content editing">
                  <a-form layout="vertical" class="task-form">
                    <a-form-item>
                      <a-input
                        v-model:value="task.editCache.name"
                        placeholder="任务名称"
                        class="task-input"
                        :bordered="false"
                        size="large"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-textarea
                        v-model:value="task.editCache.description"
                        placeholder="任务描述"
                        :rows="3"
                        class="task-textarea"
                        :bordered="false"
                      />
                    </a-form-item>
                  </a-form>
                  <div class="task-edit-actions">
                    <a-button size="small" @click="cancelEditing(task)">取消</a-button>
                    <a-button type="primary" size="small" @click="saveEditing(task)">保存</a-button>
                  </div>
                </div>
              </div>

              <div v-if="tempTask && tempTask.nodeIndex === index" 
                   class="task">
                <div class="task-content editing">
                  <a-form layout="vertical">
                    <a-form-item>
                      <a-input
                        v-model:value="tempTask.editCache.name"
                        placeholder="任务名称"
                        size="small"
                        ref="taskNameInput"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-textarea
                        v-model:value="tempTask.editCache.description"
                        placeholder="任务描述"
                        :rows="3"
                        size="small"
                      />
                    </a-form-item>
                  </a-form>
                  <div class="task-edit-actions">
                    <a-button size="small" @click="cancelEditing(tempTask)">取消</a-button>
                    <a-button type="primary" size="small" @click="saveEditing(tempTask)">保存</a-button>
                  </div>
                </div>
              </div>

              <a-button
                v-if="isEditMode && !tempTask"
                type="dashed"
                block
                @click="addTask(index)"
                class="add-task-btn"
              >
                <template #icon><plus-outlined /></template>
                添加任务
              </a-button>
            </div>
          </a-card>
        </template>
      </draggable>

      <a-button
        v-if="isEditMode"
        type="primary"
        shape="circle"
        class="add-node-btn right"
        @click="addNodeAfter(currentTimeline.nodes.length - 1)"
      >
        <template #icon><plus-outlined /></template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useTimelineStore } from '../stores/timeline'
import { useRoute, useRouter } from 'vue-router'
import type { Timeline, TimelineNode, Task } from '../types/sop'
import draggable from 'vuedraggable'
import {
  PlusOutlined,
  DeleteOutlined,
  MenuOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons-vue'
import { message, notification, Modal } from 'ant-design-vue'
import { TrophyOutlined } from '@ant-design/icons-vue'

const store = useTimelineStore()
const route = useRoute()
const router = useRouter()

// 根据是否是新建来决定初始编辑状态
const isEditMode = ref(route.name === 'create')

// 初始化时间轴数据
const currentTimeline = ref<Timeline>({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  nodes: [{
    id: crypto.randomUUID(),
    name: '',
    description: '',
    tasks: [],
    completed: false,
    createdAt: Date.now()
  }],
  createdAt: Date.now(),
  updatedAt: Date.now()
})

const Draggable = draggable

const addNodeBefore = (index: number) => {
  const newNode: TimelineNode = {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    tasks: [],
    completed: false,
    createdAt: Date.now()
  }
  currentTimeline.value.nodes.splice(index, 0, newNode)
}

const addNodeAfter = (index: number) => {
  addNodeBefore(index + 1)
}

// 修改编辑任务的逻辑，使用 Modal
const editingTask = ref({
  isEditing: false,
  editCache: {
    name: '',
    description: ''
  },
  currentTask: null as Task | null
})

const startEditing = (node: TimelineNode, taskIndex: number) => {
  const task = node.tasks[taskIndex] as EditingTask
  task.isEditing = true
  task.editCache = {
    name: task.name,
    description: task.description
  }
}

// 添加一个临时任务的 ref
const tempTask = ref<EditingTask | null>(null)

const addTask = (nodeIndex: number) => {
  // 创建临时任务
  tempTask.value = {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    completed: false,
    createdAt: Date.now(),
    isEditing: true,
    editCache: {
      name: '',
      description: ''
    },
    nodeIndex // 保存节点索引以便后续保存
  }
}

const saveEditing = (task: EditingTask) => {
  if (task === tempTask.value) {
    // 保存临时任务
    if (task.editCache?.name) { // 只有当名称不为空时才保存
      const node = currentTimeline.value.nodes[task.nodeIndex!]
      if (node) {
        node.tasks.push({
          id: task.id,
          name: task.editCache.name,
          description: task.editCache.description || '',
          completed: false,
          createdAt: task.createdAt
        })
      }
    }
    tempTask.value = null
  } else {
    // 保存现有任务的编辑
    if (task.editCache) {
      task.name = task.editCache.name
      task.description = task.editCache.description
    }
    task.isEditing = false
  }
}

const cancelEditing = (task: EditingTask) => {
  if (task === tempTask.value) {
    // 取消临时任务
    tempTask.value = null
  } else {
    // 取消现有任务的编辑
    task.isEditing = false
    task.editCache = undefined
  }
}

const deleteTask = (node: TimelineNode, task: Task) => {
  const index = node.tasks.findIndex(t => t.id === task.id)
  if (index !== -1) {
    node.tasks.splice(index, 1)
  }
}

const deleteNode = (index: number) => {
  if (currentTimeline.value.nodes.length > 1) {
    currentTimeline.value.nodes.splice(index, 1)
  } else {
    alert('至少需要保留一个节点')
  }
}

const handleDragEnd = () => {
  // 可以在这里添加额外的逻辑，比如保存到后端
}

const saveTimeline = () => {
  // 验证时间轴标题
  if (!currentTimeline.value.name.trim()) {
    message.error('请输入时间轴标题')
    return
  }

  // 验证节点标题
  const invalidNodes = currentTimeline.value.nodes.some(node => !node.name.trim())
  if (invalidNodes) {
    message.error('请为所有节点填写标题')
    return
  }

  // 验证任务标题
  const invalidTasks = currentTimeline.value.nodes.some(node => 
    node.tasks.some(task => !task.name.trim())
  )
  if (invalidTasks) {
    message.error('请为所有任务填写标题')
    return
  }

  // 过滤掉未保存的节点和任务
  const validNodes = currentTimeline.value.nodes.filter(node => node.name.trim())
  currentTimeline.value.nodes = validNodes.map(node => ({
    ...node,
    tasks: node.tasks.filter(task => task.name.trim())
  }))

  if (route.params.id) {
    store.updateTimeline(currentTimeline.value)
  } else {
    store.createTimeline(currentTimeline.value)
  }
  
  isEditMode.value = false
  message.success('保存成功')
}

// 添加返回首页按钮
const goBack = () => {
  router.push('/')
}

// 修改任务完成处理函数
const handleTaskComplete = (node: TimelineNode) => {
  const allTasksCompleted = node.tasks.every(task => task.completed)
  
  if (allTasksCompleted) {
    const allNodesCompleted = currentTimeline.value.nodes.every(n => 
      n.tasks.every(t => t.completed)
    )

    if (allNodesCompleted) {
      // 显示确认弹窗
      Modal.confirm({
        title: '完成确认',
        content: '你已经完成了所有任务，是否确认完成本次 SOP 执行？',
        okText: '确认完成',
        cancelText: '继续检查',
        centered: true,
        onOk() {
          // 显示庆祝通知
          Modal.success({
            title: '太棒了！🎉',
            content: '你已经完成了所有任务！继续保持这样的热情，你正在变得越来越优秀！',
            centered: true,
            okText: '继续前进',
            class: 'celebration-modal',
            onOk() {
              // 重置所有任务的完成状态
              currentTimeline.value.nodes.forEach(node => {
                node.tasks.forEach(task => {
                  task.completed = false
                })
              })
              // 保存更新后的状态
              store.updateTimeline(currentTimeline.value)
            }
          })
        }
      })
    } else {
      // 显示节点完成通知
      Modal.success({
        title: '做得好！👏',
        content: '你完成了这个节点的所有任务！继续前进，你离目标又近了一步！',
        centered: true,
        okText: '继续加油'
      })
    }
  }
}

onMounted(() => {
  if (route.params.id) {
    // 编辑现有时间轴
    const timeline = store.getTimelineById(route.params.id as string)
    if (timeline) {
      currentTimeline.value = { ...timeline }
      // 编辑现有时间轴时默认为预览态
      isEditMode.value = false
    }
  } else {
    // 新建时间轴时默认为编辑态
    isEditMode.value = true
  }
})
</script>

<style scoped>
.editor {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
}

.header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
}

.timeline-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.timeline-nodes {
  padding: 20px 40px;
  display: flex;
  position: relative;
  overflow-x: auto;
}

.nodes-container {
  display: flex;
  gap: 20px;
}

.node {
  width: 300px;
  flex-shrink: 0;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-handle {
  cursor: move;
  color: #999;
}

.tasks {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
}

.task-content {
  padding: 12px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-name {
  font-size: 14px;
  color: #2c3e50;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task.completed .task-name {
  text-decoration: line-through;
  color: #999;
}

.edit-btn {
  margin-top: 4px;
  padding: 0;
  height: auto;
}

.add-node-btn {
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.add-node-btn.left {
  left: 0;
  margin-right: 20px;
}

.add-node-btn.right {
  right: 0;
  margin-left: 20px;
}

.add-task-btn {
  margin-top: 16px;
}

.delete-btn {
  margin-top: 4px;
  padding: 0;
  height: auto;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.task-content.editing {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.task-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.timeline-title-input {
  font-size: 20px;
  font-weight: 600;
  width: 300px;
  border: none;
  border-bottom: 2px solid #e8e8e8;
  padding: 4px 0;
}

.timeline-title-input:hover,
.timeline-title-input:focus {
  border-bottom-color: #1890ff;
}

.task-form {
  margin-bottom: 0;
}

.task-input {
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.task-input:hover,
.task-input:focus {
  border-bottom-color: #1890ff;
}

.task-textarea {
  font-size: 14px;
  line-height: 1.6;
  padding: 8px 0;
  background: #fafafa;
  border-radius: 4px;
}

/* 修改庆祝弹窗样式 */
:deep(.celebration-modal) {
  .ant-modal-content {
    background: linear-gradient(135deg, #fff9c4 0%, #ffffff 100%);
    border: 1px solid #ffd54f;
  }
  
  .ant-modal-confirm-title {
    font-size: 24px;
    text-align: center;
    color: #f57c00;
  }
  
  .ant-modal-confirm-content {
    font-size: 16px;
    text-align: center;
    margin-top: 16px;
  }
  
  .ant-modal-confirm-btns {
    justify-content: center;
    margin-top: 24px;
  }
}

/* 任务完成时的样式 */
.task.completed {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.task.completed .task-name {
  text-decoration: line-through;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style> 