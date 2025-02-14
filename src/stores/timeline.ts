import { defineStore } from 'pinia'
import { Timeline, TimelineNode, Task } from '../types/sop'

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    timelines: [] as Timeline[]
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['timelines']
      }
    ]
  },

  actions: {
    createTimeline(timeline: Timeline) {
      this.timelines.push(timeline)
    },

    updateTimeline(timeline: Timeline) {
      const index = this.timelines.findIndex(t => t.id === timeline.id)
      if (index !== -1) {
        this.timelines[index] = timeline
      }
    },

    getTimelineById(id: string) {
      return this.timelines.find(t => t.id === id)
    },

    addNode(timelineId: string, name: string, description: string) {
      const timeline = this.timelines.find(t => t.id === timelineId)
      if (!timeline) return

      const node: TimelineNode = {
        id: crypto.randomUUID(),
        name,
        description,
        tasks: [],
        completed: false,
        createdAt: Date.now()
      }
      timeline.nodes.push(node)
      timeline.updatedAt = Date.now()
      return node
    },

    addTask(timelineId: string, nodeId: string, name: string, description: string) {
      const timeline = this.timelines.find(t => t.id === timelineId)
      if (!timeline) return

      const node = timeline.nodes.find(n => n.id === nodeId)
      if (!node) return

      const task: Task = {
        id: crypto.randomUUID(),
        name,
        description,
        completed: false,
        createdAt: Date.now()
      }
      node.tasks.push(task)
      timeline.updatedAt = Date.now()
      return task
    },

    exportData() {
      return JSON.stringify(this.timelines, null, 2)
    },

    deleteTimeline(id: string) {
      const index = this.timelines.findIndex(t => t.id === id)
      if (index !== -1) {
        this.timelines.splice(index, 1)
      }
    },

    deleteNode(timelineId: string, nodeId: string) {
      const timeline = this.timelines.find(t => t.id === timelineId)
      if (!timeline) return

      const index = timeline.nodes.findIndex(n => n.id === nodeId)
      if (index !== -1) {
        timeline.nodes.splice(index, 1)
        timeline.updatedAt = Date.now()
      }
    },

    reorderNodes(timelineId: string, nodes: TimelineNode[]) {
      const timeline = this.timelines.find(t => t.id === timelineId)
      if (!timeline) return

      timeline.nodes = nodes
      timeline.updatedAt = Date.now()
    }
  }
}) 