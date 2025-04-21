import { createVNode, render } from 'vue';
import GhibliMessage from '@/components/GhibliMessage.vue';

// 创建消息容器
const createMessageContainer = () => {
  const container = document.createElement('div');
  container.className = 'ghibli-message-container-wrapper';
  document.body.appendChild(container);
  return container;
};

// 获取或创建消息容器
const getMessageContainer = () => {
  let container = document.querySelector('.ghibli-message-container-wrapper');
  if (!container) {
    container = createMessageContainer();
  }
  return container;
};

// 创建并显示消息
const createMessage = (
  content: string, 
  type: 'success' | 'error' | 'info' | 'warning' = 'info', 
  duration = 3000
) => {
  const container = getMessageContainer();
  const vnode = createVNode(GhibliMessage, {
    content,
    type,
    duration
  });
  
  const div = document.createElement('div');
  render(vnode, div);
  container.appendChild(div);
  
  // 自动清理
  setTimeout(() => {
    render(null, div);
    container.removeChild(div);
    if (container.childNodes.length === 0) {
      document.body.removeChild(container);
    }
  }, duration + 300); // 给消失动画留点时间
};

// 导出不同类型的消息函数
export const message = {
  success: (content: string, duration?: number) => createMessage(content, 'success', duration),
  error: (content: string, duration?: number) => createMessage(content, 'error', duration),
  info: (content: string, duration?: number) => createMessage(content, 'info', duration),
  warning: (content: string, duration?: number) => createMessage(content, 'warning', duration)
};

export default message; 