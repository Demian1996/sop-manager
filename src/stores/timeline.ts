import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Timeline, TimelineNode as ITimelineNode, Task } from '@/types/sop';
import { message } from 'ant-design-vue';

export const useTimelineStore = defineStore(
  'timeline',
  () => {
    // state
    const timelines = ref<Timeline[]>([]);

    // actions
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

    function getTimelineById(id: string) {
      return timelines.value.find((t) => t.id === id);
    }

    function exportData() {
      return JSON.stringify(timelines.value, null, 2);
    }

    function createEmptyTimeline(): Timeline {
      return {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        nodes: [createEmptyNode()],
      };
    }

    function createEmptyNode(): ITimelineNode {
      return {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        tasks: [],
        completed: false,
      };
    }

    function createEmptyTask(): Task {
      return {
        id: crypto.randomUUID(),
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

    function addTask(node: ITimelineNode, task: Task) {
      node.tasks.push(task);
    }

    function updateTask(node: ITimelineNode, task: Task) {
      const index = node.tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        node.tasks[index] = task;
      }
    }

    function deleteTask(node: ITimelineNode, task: Task) {
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

    return {
      timelines,
      createTimeline,
      updateTimeline,
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
