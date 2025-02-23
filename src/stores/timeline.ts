import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Timeline, TimelineNode, Task } from '@/types/sop';
import { message } from 'ant-design-vue';

export const useTimelineStore = defineStore(
  'timeline',
  () => {
    const timelines = ref<Timeline[]>([]);

    function createTimeline(timeline: Timeline) {
      timelines.value.push(timeline);
    }

    function deleteTimeline(id: string) {
      const index = timelines.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        timelines.value.splice(index, 1);
      }
    }

    function updateTimeline(timeline: Timeline) {
      const index = timelines.value.findIndex((t) => t.id === timeline.id);
      if (index !== -1) {
        timelines.value[index] = timeline;
      }
    }

    function duplicateTimeline(id: string) {
      const timeline = timelines.value.find((t) => t.id === id);
      if (timeline) {
        timelines.value.push({ ...timeline, id: generateId(), name: `${timeline.name} (副本)` });
      }
    }

    function getTimelineById(id: string) {
      return timelines.value.find((t) => t.id === id);
    }

    function exportData() {
      return JSON.stringify(timelines.value, null, 2);
    }

    function createEmptyTimeline(): Timeline {
      return {
        id: generateId(),
        name: '',
        description: '',
        nodes: [createEmptyNode()],
      };
    }

    function createEmptyNode(): TimelineNode {
      return {
        id: generateId(),
        name: '',
        description: '',
        tasks: [],
      };
    }

    function createEmptyTask(): Task {
      return {
        id: generateId(),
        name: '',
        description: '',
        completed: false,
      };
    }

    function addNodeBefore(timeline: Timeline, index: number) {
      timeline.nodes.splice(index, 0, createEmptyNode());
    }

    function addNodeAfter(timeline: Timeline, index: number) {
      timeline.nodes.splice(index + 1, 0, createEmptyNode());
    }

    function deleteNode(timeline: Timeline, index: number) {
      timeline.nodes.splice(index, 1);
    }

    function addTask(node: TimelineNode, task: Task) {
      node.tasks.push(task);
    }

    function updateTask(node: TimelineNode, task: Task) {
      const index = node.tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        node.tasks[index] = task;
      }
    }

    function deleteTask(node: TimelineNode, task: Task) {
      const index = node.tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        node.tasks.splice(index, 1);
      }
    }

    function validateTimeline(timeline: Timeline): boolean {
      // 验证时间轴标题
      if (!timeline.name.trim()) {
        message.error('请输入时间轴标题');
        return false;
      }

      // 验证节点标题
      const invalidNodes = timeline.nodes.some((node) => !node.name.trim());
      if (invalidNodes) {
        message.error('请为所有节点填写标题');
        return false;
      }

      // 验证任务标题
      const invalidTasks = timeline.nodes.some((node) => node.tasks.some((task) => !task.name.trim()));
      if (invalidTasks) {
        message.error('请为所有任务填写标题');
        return false;
      }

      return true;
    }

    // 重置所有任务的进度
    function resetAllTasks(timeline: Timeline) {
      timeline.nodes.forEach((node) => {
        node.tasks.forEach((task) => {
          task.completed = false;
        });
      });
    }

    // 完成某个任务
    function completeTask(task: Task) {
      task.completed = true;
    }

    // 取消某个任务
    function cancelTask(task: Task) {
      task.completed = false;
    }

    function generateId(): string {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const length = 16;
      let result = '';
      
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
      }
      
      return result;
    }

    return {
      timelines,
      createTimeline,
      updateTimeline,
      duplicateTimeline,
      getTimelineById,
      exportData,
      deleteTimeline,
      createEmptyTimeline,
      createEmptyNode,
      createEmptyTask,
      addNodeBefore,
      addNodeAfter,
      deleteNode,
      addTask,
      updateTask,
      deleteTask,
      validateTimeline,
      resetAllTasks,
      completeTask,
      cancelTask,
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
          paths: ['timelines'],
        },
      ],
    },
  } as any
);
