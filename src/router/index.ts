import { createRouter, createWebHistory } from 'vue-router';
import TimelineList from '@/views/TimelineList.vue';
import TimelineCreator from '@/views/TimelineCreator.vue';
import TimelineEditor from '@/views/TimelineEditor.vue';
// import TimelineRunner from '@/views/TimelineRunner.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TimelineList,
    },
    {
      path: '/create',
      name: 'create',
      component: TimelineCreator,
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: TimelineEditor,
    },
    // {
    //   path: '/run/:id',
    //   name: 'run',
    //   component: TimelineRunner,
    // },
  ],
});

export default router;
