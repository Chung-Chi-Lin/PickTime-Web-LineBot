import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'logIn',
    component: () => import('../../../TodoList-Web/src/views/logIn.vue'),
  },
  {
    path: '/signUp',
    name: 'signUp',
    component: () => import('../../../TodoList-Web/src/views/signUp.vue'),
  },
  {
    path: '/rideShare',
    name: 'rideShare',
    component: () => import('../../../TodoList-Web/src/views/rideShare.vue'),
    props: (route) => route.params,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
