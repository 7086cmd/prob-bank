import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/beta-test',
      name: 'beta-test',
      component: () => import('../views/BetaProductions.vue')
    },
    {
      path: '/problem',
      name: 'problem',
      component: () => import('../views/problem/ProblemView.vue')
    },
    {
      path: '/problem/insert',
      name: 'problem_insert',
      component: () => import('../views/problem/InsertProblem.vue')
    },
    {
      path: '/problem/modify/:id',
      name: 'problem_modify',
      component: () => import('../views/problem/ModifyProblem.vue')
    },
    {
      path: '/problem/display/:id',
      name: 'problem_display',
      component: () => import('../views/problem/DisplayProblem.vue')
    },
    {
      path: '/problem-group/insert',
      name: 'problem-group_insert',
      component: () => import('../views/problem-group/InsertProblemGroup.vue')
    },
    {
      path: '/problem-group/modify/:id',
      name: 'problem-group_modify',
      component: () => import('../views/problem-group/ModifyProblemGroup.vue')
    },
    {
      path: '/problem-group/display/:id',
      name: 'problem-group_display',
      component: () => import('../views/problem-group/DisplayProblemGroup.vue')
    },
    {
      path: '/problem-group',
      name: 'problem-group',
      component: () => import('../views/problem-group/ProblemGroupView.vue')
    },
    {
      path: '/help/markdown',
      name: 'help_markdown',
      component: () => import('../docs/MarkdownHelp.md')
    },
    {
      path: '/paper/modify',
      name: 'paper_modify',
      component: () => import('../views/paper/CreatePaper.vue')
    },
    {
      path: '/paper/',
      name: 'paper',
      component: () => import('../views/paper/ViewPaper.vue')
    },
    {
      path: '/settings/',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    }
  ]
})

export default router
