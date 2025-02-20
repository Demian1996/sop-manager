import { defineStore } from 'pinia';
import { Timeline, TimelineNode, Task } from '@/types/sop';
import { ref } from 'vue';

export const useTimelineStore = defineStore(
  'timeline',
  () => {
    // state
    const timelines = ref<Timeline[]>([]);

    // actions
    function createTimeline(timeline: Timeline) {
      timelines.value.push(timeline);
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

    function addNode(timelineId: string, name: string, description: string) {
      const timeline = timelines.value.find((t) => t.id === timelineId);
      if (!timeline) return;

      const node: TimelineNode = {
        id: crypto.randomUUID(),
        name,
        description,
        tasks: [],
        completed: false,
      };
      timeline.nodes.push(node);
      return node;
    }

    function addTask(timelineId: string, nodeId: string, name: string, description: string) {
      const timeline = timelines.value.find((t) => t.id === timelineId);
      if (!timeline) return;

      const node = timeline.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const task: Task = {
        id: crypto.randomUUID(),
        name,
        description,
        completed: false,
      };
      node.tasks.push(task);
      return task;
    }

    function exportData() {
      return JSON.stringify(timelines.value, null, 2);
    }

    function deleteTimeline(id: string) {
      const index = timelines.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        timelines.value.splice(index, 1);
      }
    }

    function deleteNode(timelineId: string, nodeId: string) {
      const timeline = timelines.value.find((t) => t.id === timelineId);
      if (!timeline) return;

      const index = timeline.nodes.findIndex((n) => n.id === nodeId);
      if (index !== -1) {
        timeline.nodes.splice(index, 1);
      }
    }

    function reorderNodes(timelineId: string, nodes: TimelineNode[]) {
      const timeline = timelines.value.find((t) => t.id === timelineId);
      if (!timeline) return;

      timeline.nodes = nodes;
    }

    return {
      timelines,
      createTimeline,
      updateTimeline,
      getTimelineById,
      addNode,
      addTask,
      exportData,
      deleteTimeline,
      deleteNode,
      reorderNodes,
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
