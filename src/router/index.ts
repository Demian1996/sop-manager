import { createRouter, createWebHistory } from 'vue-router'
import TimelineList from '../views/TimelineList.vue'
import TimelineEditor from '../views/TimelineEditor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TimelineList
    },
    {
      path: '/create',
      name: 'create',
      component: TimelineEditor
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: TimelineEditor
    }
  ]
})

export default router 