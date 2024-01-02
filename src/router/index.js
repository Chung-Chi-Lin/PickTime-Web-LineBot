import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'logIn',
    component: () => import('@/views/logIn.vue'),
  },
  {
    path: '/',
    name: 'logIn',
    component: () => import('@/views/logIn.vue'),
  },
  {
    path: '/signUp',
    name: 'signUp',
    component: () => import('@/views/signUp.vue'),
  },
  {
    path: '/passengerRideShare',
    name: 'passengerRideShare',
    component: () => import('@/views/passengerRideShare.vue'),
    props: (route) => route.params,
  },
  {
    path: '/driverRideShare',
    name: 'driverRideShare',
    component: () => import('@/views/driverRideShare.vue'),
    props: (route) => route.params,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
