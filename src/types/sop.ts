export interface Task {
  id: string
  name: string
  description: string
  completed: boolean
  createdAt: number
}

export interface TimelineNode {
  id: string
  name: string
  description: string
  tasks: Task[]  // 支持并行任务
  completed: boolean
  createdAt: number
}

export interface Timeline {
  id: string
  name: string
  description: string
  nodes: TimelineNode[]
  createdAt: number
  updatedAt: number
} 