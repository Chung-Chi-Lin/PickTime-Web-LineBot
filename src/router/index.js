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
    path: '/passengerRideShare',
    name: 'passengerRideShare',
    component: () => import('../../../TodoList-Web/src/views/passengerRideShare.vue'),
    props: (route) => route.params,
  },
  {
    path: '/driverRideShare',
    name: 'driverRideShare',
    component: () => import('../../../TodoList-Web/src/views/driverRideShare.vue'),
    props: (route) => route.params,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
