import { createVNode, render, ref } from 'vue';
import GhibliModal from '@/components/GhibliModal.vue';

interface ModalOptions {
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  width?: string;
  showCancel?: boolean;
  danger?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

const createModalContainer = () => {
  const container = document.createElement('div');
  container.className = 'ghibli-modal-container-wrapper';
  document.body.appendChild(container);
  return container;
};

const getModalContainer = () => {
  let container = document.querySelector('.ghibli-modal-container-wrapper');
  if (!container) {
    container = createModalContainer();
  }
  return container;
};

export const modal = {
  confirm: (options: ModalOptions) => {
    const container = getModalContainer();
    const div = document.createElement('div');
    
    const visible = ref(true);
    
    const vnode = createVNode(GhibliModal, {
      ...options,
      visible: visible.value,
      danger: options.danger || false,
      'onUpdate:visible': (value: boolean) => {
        visible.value = value;
        if (!value) {
          setTimeout(() => {
            render(null, div);
            container.removeChild(div);
            if (container.childNodes.length === 0) {
              document.body.removeChild(container);
            }
          }, 300);
        }
      },
      onOk: () => {
        options.onOk?.();
      },
      onCancel: () => {
        options.onCancel?.();
      }
    });
    
    render(vnode, div);
    container.appendChild(div);
  },
  
  success: (options: Omit<ModalOptions, 'danger'>) => {
    modal.confirm({
      ...options,
      danger: false,
      showCancel: false
    });
  },
  
  error: (options: Omit<ModalOptions, 'danger'>) => {
    modal.confirm({
      ...options,
      danger: true,
      showCancel: false
    });
  }
};

export default modal; 