import type { Timeline, TimelineNode as ITimelineNode, Task } from '@/types/sop';
import { message } from 'ant-design-vue';

export const createEmptyTimeline = (): Timeline => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  nodes: [createEmptyNode()],
});

export const createEmptyNode = (): ITimelineNode => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  tasks: [],
  completed: false,
});

export const createEmptyTask = (): Task => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  completed: false,
});

export const addNodeBefore = (timeline: Timeline, index: number) => {
  timeline.nodes.splice(index, 0, createEmptyNode());
};

export const addNodeAfter = (timeline: Timeline, index: number) => {
  timeline.nodes.splice(index + 1, 0, createEmptyNode());
};

export const deleteNode = (timeline: Timeline, index: number) => {
  timeline.nodes.splice(index, 1);
};

export const addTask = (node: ITimelineNode, task: Task) => {
  node.tasks.push(task);
};

export const updateTask = (node: ITimelineNode, task: Task) => {
  const index = node.tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    node.tasks[index] = task;
  }
};

export const deleteTask = (node: ITimelineNode, task: Task) => {
  const index = node.tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    node.tasks.splice(index, 1);
  }
};

export const validateTimeline = (timeline: Timeline): boolean => {
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
  const invalidTasks = timeline.nodes.some((node) => 
    node.tasks.some((task) => !task.name.trim())
  );
  if (invalidTasks) {
    message.error('请为所有任务填写标题');
    return false;
  }

  return true;
};