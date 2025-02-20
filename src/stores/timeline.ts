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

    return {
      timelines,
      createTimeline,
      updateTimeline,
      getTimelineById,
      exportData,
      deleteTimeline,
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
